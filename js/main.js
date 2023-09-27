// &===========>HTML ELEMENTS============================>
const model = document.getElementById("model");
const showModelBtn = document.getElementById("showModelBtn");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const taskStatus = document.getElementById("status");
const taskTitle = document.getElementById("title");
// const taskTag = document.getElementById("tagLine");
const taskCategory = document.getElementById("category");
const taskDescription = document.getElementById("description");

const gridBtn = document.getElementById("gridBtn");
const barsBtn = document.getElementById("barsBtn");

const section = document.querySelectorAll("section");

const containerTasks = document.querySelectorAll(".tasks");

const modeBtn = document.getElementById("mode");
const root = document.querySelector(":root");

const searchInput = document.getElementById("searchInput");
const titleAlert = document.getElementById("titleAlert");
// const tagAlert = document.getElementById("tagAlert");
const descAlert = document.getElementById("descAlert");

const remainingCounter = document.getElementById("remainingCounter");
let tasksObj = {
  // ...
  pinned: false, // Add this property
  lastUpdated: 0, // Add this property
};

// *===========>VARIABLES============================>
let updatedTaskIndex;
let color;
let maxCounter = 100;
const container = {
  inProgress: document.getElementById("inProgress"),
  nextUp: document.getElementById("nextUp"),
  // done: document.getElementById("done"),
};
let tasksArr = JSON.parse(localStorage.getItem("tasks")) || []; //if there is something in taskArr it will bring it else (empty)
for (let i = 0; i < tasksArr.length; i++) {
  displayTasks(i);
}

// ^===================EVENTS======================>
showModelBtn.addEventListener("click", showModel);
addBtn.addEventListener("click", addNewTask);
updateBtn.addEventListener("click", updateTask);
barsBtn.addEventListener("click", changeViewToPars);
gridBtn.addEventListener("click", changeViewToGrid);
modeBtn.addEventListener("click", changeMode);
searchInput.addEventListener("input", searchTask);
// ~===========>FUNCTIONS============================>
function showModel() {
  model.classList.replace("d-none", "d-flex");
  document.body.style.overflow = "hidden";
  hideAlert()
  resetRemCounter()
}
function hideModel() {
  model.classList.replace("d-flex", "d-none");
  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  document.body.style.overflow = "visible";
  hideAlert()
  clear();
  resetRemCounter()
}
function hideAlert() {
  let alert = Array.from(document.querySelectorAll(".alert"));
  for(let i=0;i<alert.length;i++){
    alert[i].classList.add("d-none");
  }  
}
//?=================>HIDE MODEL USING ESCAPE
document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    hideModel();
  }
});
//^=================>HIDE MODEL USING SPACE AROUND IT

model.addEventListener("click", function (e) {
  if (e.srcElement.id == "model") {
    hideModel();
  }
});

console.log(alert);
function addNewTask() {

  if (
    validate(titleRegex, taskTitle) &&
    validate(descriptionRegex, taskDescription)
  ) {
    let tasksObj = {
      status: taskStatus.value,
      category: taskCategory.value,
      title: taskTitle.value,
      // tagLine:taskTag.value,
      description: taskDescription.value,
    };
    tasksArr.push(tasksObj);
    setTasksInLocalStorage();
    hideModel();
    displayTasks(tasksArr.length - 1);
    clear();
    resetRemCounter();
  }
}

// Function to toggle the pinned state of a note
function togglePin(index) {
  tasksArr[index].pinned = !tasksArr[index].pinned;
  setTasksInLocalStorage();
  emptyContainer();
  for (let i = 0; i < tasksArr.length; i++) {
    displayTasks(i);
  }
}
//function for last update
function updateLastUpdated(index) {
  tasksArr[index].lastUpdated = Date.now();
  setTasksInLocalStorage();
}


function displayTasks(index) {
  const pinnedClass = tasksArr[index]?.pinned ? "pinned" : "";
  taskHTML = `
    <div class="task ${pinnedClass}">
    <h3 class="text-capitalize">${tasksArr[index]?.title}</h3>
    <p class="description text-capitalize">${tasksArr[index]?.description}</p>
    <h4 class="category categotryHead ${tasksArr[index]?.category} text-capitalize px-3 py-2">${tasksArr[index]?.category}</h4>
    <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
    <li><i class="bi bi-pencil-square" onclick="setTaskForUpdate(${index})"></i></li>
            <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
            <li><i class="bi bi-palette-fill" onclick=" changeColor(event)"></i></li>
          </ul>
      </div>
      `;


 // Update the lastUpdated timestamp when a note is edited
 taskTitle.addEventListener("input", () => {
  validate(titleRegex, taskTitle);
  updateLastUpdated(index); // Update the timestamp on title input
});

taskDescription.addEventListener("input", () => {
  validate(descriptionRegex, taskDescription);
  updateLastUpdated(index); // Update the timestamp on description input
});
  let x = tasksArr[index].status;

  x.innerHTML = taskHTML;
  container[x].querySelector(".tasks").innerHTML += taskHTML;
  
  setTasksInLocalStorage();
}

// Sort the tasks by pinned status and lastUpdated timestamp
function sortTasks() {
  tasksArr.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return b.lastUpdated - a.lastUpdated; // Sort by lastUpdated timestamp in descending order
    } else {
      return a.pinned ? -1 : 1; // Pinned notes come first
    }
  });
}


function deleteTask(index) {
  emptyContainer(); //empty the container and full it  after delete the index
  tasksArr.splice(index, 1);

  setTasksInLocalStorage();
  for (let i = 0; i < tasksArr.length; i++) {
    displayTasks(i);
  }
}
function emptyContainer() {
  for (item in container) {
    container[item].querySelector(".tasks").innerHTML = "";
  }
}
function setTaskForUpdate(index) {
  showModel();
  updatedTaskIndex = index;
  taskStatus.value = tasksArr[index].status;
  taskCategory.value = tasksArr[index].category;
  taskTitle.value = tasksArr[index].title;
  // taskTag.value = tasksArr[index].tagLine;
  taskDescription.value = tasksArr[index].description;
  updateBtn.classList.replace("d-none", "d-block");
  addBtn.classList.replace("d-block", "d-none");
}
function setTasksInLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}
function clear() {
  taskTitle.value = "";
  taskTag.value="";
  taskDescription.value = "";
  taskTitle.classList.remove("is-valid");
  taskTitle.classList.remove("is-invalid");
  // taskTag.classList.remove("is-valid");
  // taskTag.classList.remove("is-invalid");
  taskDescription.classList.remove("is-invalid");
  taskDescription.classList.remove("is-valid");
}
function updateTask() {
  emptyContainer();
  tasksArr[updatedTaskIndex].status = taskStatus.value;
  tasksArr[updatedTaskIndex].category = taskCategory.value;
  tasksArr[updatedTaskIndex].title = taskTitle.value;
  // tasksArr[updatedTaskIndex].tagLine = taskTag.value;
  tasksArr[updatedTaskIndex].description = taskDescription.value;
  setTasksInLocalStorage();
    // Call the sortTasks function before displaying tasks
sortTasks();

  for (let i = 0; i < tasksArr.length; i++) {
    displayTasks(i);
  }
  hideModel();
  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  clear();
  resetRemCounter();
}
function generateColor() {
  var colorChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  color = "#";
  for (let i = 1; i <= 6; i++) {
    let random = Math.trunc(Math.random() * colorChar.length);
    color += colorChar[random];
  }
  return color + "22";
}
function changeColor(e) {
  e.target.closest(".task").style.backgroundColor = generateColor();
}
function changeViewToPars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");
  for (let i = 0; i < section.length; i++) {
    section[i].classList.remove("col-md-6", "col-lg-4");
  }
  for (let j = 0; j < containerTasks.length; j++) {
    containerTasks[j].setAttribute("data-view", "bars");
  }
}
function changeViewToGrid() {
  gridBtn.classList.add("active");
  barsBtn.classList.remove("active");
  for (let i = 0; i < section.length; i++) {
    section[i].classList.add("col-md-6", "col-lg-4");
  }
  for (var j = 0; j < containerTasks.length; j++) {
    containerTasks[j].removeAttribute("data-view");
  }
}

function changeMode() {
  if (modeBtn.classList.contains("bi-moon-stars-fill")) {
    root.style.setProperty("--main-black", "white");
    root.style.setProperty("--text-color", "black");
    root.style.setProperty("--sec-black", "#fafafa");
    root.style.setProperty("--mid-gray", "#dadada");
    root.style.setProperty("--categotryHead-color", "white");
    root.style.setProperty("--bs-btn-color", "rgb(94, 227, 0)");
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
    let btn = Array.from(document.querySelectorAll(".btn"));
    for (let i = 0; i < btn.length; i++) {
      btn[i].classList.add("cLight");
    }
  } else {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--text-color", "#a5a6a7");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--mid-gray", "#474a4e");
    root.style.setProperty("--categotryHead-color", "#a5a6a7");

    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
    let btn = Array.from(document.querySelectorAll(".btn"));
    for (let i = 0; i < btn.length; i++) {
      btn[i].classList.remove("cLight");
    }
  }
}
function searchTask() {
  emptyContainer();
  var searchKey = searchInput.value;
  for (var i = 0; i < tasksArr.length; i++) {
    if (
      tasksArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
      tasksArr[i].tag.toLowerCase().includes(searchKey.toLowerCase())
    ) {
      displayTasks(i);
    }
  }
}
// *==============================>validation
var titleRegex = /^[a-zA-Z]{3,}/;
var descriptionRegex = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.add("d-none");

    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.parentElement.nextElementSibling.classList.remove("d-none");
    return false;
  }
}
taskTitle.addEventListener("input", () => {
  validate(titleRegex, taskTitle);
});
taskTag.addEventListener("input", () => {
  validate(tagRegex, taskTag);
});
taskDescription.addEventListener("input", () => {
  validate(descriptionRegex, taskDescription);
});

// &======================>remaining counter
taskDescription.addEventListener("input", () => {
  let remaining = maxCounter - taskDescription.value.length;
  remainingCounter.innerHTML = remaining;
});
function resetRemCounter() {
  remainingCounter.innerHTML = 100;
}
