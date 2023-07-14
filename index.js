const authSendData = {
  email: email,
  password: password,
};
const authEndpoint = "https://api.devpipeline.org/user/auth";
const namesEndpoint = "https://api.devpipeline.org/users";

let namePool = [];
let animationArr = [];
let appReadyNames = {};

const scrollBarBodyDiv = document.getElementById("scrollBarBodyDiv");
const randomResultP = document.getElementById("randomResultP");
const randomResultShuffle = document.getElementById("randomResultShuffle");
randomResultShuffle.addEventListener("click", winningName);

// App execution
async function appSequence() {
  await load(authSendData, authEndpoint, namesEndpoint);

  // Builds scroll bar body contents
  for (const name of namePool) {
    appReadyNames[name] = countName(name);
  }

  loadNamesToDisplay();
}

// Requests & stores to name pool
async function load(authSendData, authEndpoint, namesEndpoint) {
  let authToken;
  let users = [];

  async function getAuth() {
    const rawAuth = await fetch(authEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authSendData),
    });
    const jsonAuth = await rawAuth.json();
    authToken = jsonAuth.auth_info.auth_token;
  }
  await getAuth();

  async function getNames() {
    const fetchNames = await fetch(namesEndpoint, {
      headers: {
        auth_token: authToken,
      },
    });
    const response = await fetchNames.json();
    users = response.users;
  }
  await getNames();

  users.map((user) => {
    namePool.push(`${user.first_name} ${user.last_name}`);
    animationArr.push(`${user.first_name} ${user.last_name}`);
  });
}

// Counts name weight in name pool
function countName(name) {
  let nameCounter = 0;
  for (const item of namePool) {
    if (item === name) {
      nameCounter += 1;
    }
  }
  return nameCounter;
}

// Removes first occurence of name from name pool
function subtractButtonFunction(name) {
  if (countName(name) < 1) {
    return;
  }
  const nameIndex = namePool.indexOf(name);
  namePool.splice(nameIndex, 1);
  appReadyNames[name] = countName(name);
  clearNameDisplay();
  loadNamesToDisplay();
}

// Adds name to name pool
function addButtonFunction(name) {
  namePool.push(name);
  appReadyNames[name] = countName(name);
  clearNameDisplay();
  loadNamesToDisplay();
}

// Builds HTML elements for scroll bar body
function loadNameDisplay(name) {
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "nameDivs");
  newDiv.setAttribute("id", name);
  scrollBarBodyDiv.appendChild(newDiv);

  let newPTag = document.createElement("p");
  newPTag.setAttribute("class", "nameTags");
  newPTag.textContent = `${name}: ${countName(name)}`;
  newDiv.appendChild(newPTag);

  let buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("class", "buttonDivs");
  newDiv.appendChild(buttonDiv);

  let subtractButton = document.createElement("button");
  subtractButton.setAttribute("class", "subtractButtons");
  subtractButton.textContent = "-";
  buttonDiv.appendChild(subtractButton);
  subtractButton.addEventListener("click", () => subtractButtonFunction(name));

  let addButton = document.createElement("button");
  addButton.setAttribute("class", "addButtons");
  addButton.textContent = "+";
  buttonDiv.appendChild(addButton);
  addButton.addEventListener("click", () => addButtonFunction(name));
}

// Populates scroll bar body
function loadNamesToDisplay() {
  for (const name in appReadyNames) {
    loadNameDisplay(name, appReadyNames[name]);
  }
}

function clearNameDisplay() {
  scrollBarBodyDiv.innerHTML = "";
}

function winningName() {
  clearNameDisplay();
  loadNamesToDisplay();
  if (namePool.length > 0) {
    winningIndex = Math.floor(Math.random() * namePool.length);
    randomResultP.textContent = `${namePool[winningIndex]}`;
    let winningNameDiv = document.getElementById(namePool[winningIndex]);
    winningNameDiv.style.backgroundColor = "#FDE047";
    console.log(namePool[winningIndex]);
  } else {
    randomResultP.textContent = "Random Result";
  }
}

appSequence();
