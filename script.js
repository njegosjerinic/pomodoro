// --- DOM Elements ---
const body = document.body;
const countdownDisplay = document.getElementById("countdownDisplay");
const title = document.getElementById("title");
const taskContainer = document.getElementById("container-for-tasks");
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const timeRestInput = document.getElementById("timeRestInput");
const timeLongRestInput = document.getElementById("longBreakTimeInput");
const longBreakInput = document.getElementById("longBreakTimeInput");
const amountOfPomodorosInput = document.getElementById(
  "amountOfPomodorosInput"
);
const tasks = document.querySelectorAll(".task");
const pomodorosCounter = document.getElementById("pomodorosCounter");
const longBrakeIntervalInput = document.getElementById(
  "longBrakeIntervalInput"
);

// Buttons
const timeBtnStart = document.getElementById("timeBtnStart");
const timeBtnPause = document.getElementById("timeBtnPause");
const timeBtnFF = document.getElementById("timeBtnFF");
const addTaskBtn = document.getElementById("addTaskBtn");
const exitSettingsButton = document.getElementById("exit-settings");
const createTask = document.getElementById("createTask");
const cancelCreation = document.getElementById("cancelCreation");
const inputBtn = document.getElementById("inputTimeBtn");
const workModeBtn = document.getElementById("workModeBtn");
const shortBrakeModeBtn = document.getElementById("shortBrakeBtn");
const longBrakeModeBtn = document.getElementById("longBrakeBtn");

// Panels and Screens
const settingsScreen = document.querySelector(".settings-screen");
const addTaskPanel = document.getElementById("addTaskPanel");
const overlay = document.getElementById("overlay");

// Audio
const audio = new Audio("audiomass-output.mp3");

// --- App State ---
let countdown;
let restCountdown;
let longRestCountdown;
let isPaused = false;
let isWorking = true;
let numberOfTasks = 0;
let pomodosCounter =
  parseInt(sessionStorage.getItem("allPomodorosCounter")) || 1;
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let baseWorkingTimer = 30;

//==============UTILITIES==================//
//This takes input that has been translated to seconds and translates it back to minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

//Gets input and transforms it into seconds
function getInput(input) {
  const duration = parseInt(input);
  if (isNaN(duration) || duration <= 0) {
    alert("Please enter a right amount of minutes for work");
    return null;
  }
  return input * 60;
}

//These are the states of the timer in the app
function preWorking() {
  body.style.backgroundColor = "rgb(186, 73, 73)";
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function working() {
  body.style.backgroundColor = "rgb(186, 73, 73)";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
}

function showWorkDarkModeUI() {
  body.style.backgroundColor = "black";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "none";
  addTaskBtn.style.display = "none";
  title.style.display = "none";
}

function preRestingShort() {
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = "green";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function restingShort() {
  body.style.backgroundColor = "green";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function preRestingLong(){
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = "lightblue";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function restingLong(){
  body.style.backgroundColor = "lightblue";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}



//States that have to do with pausing
function pauseCountdownWork() {
  isPaused = true;
  timeBtnPause.innerText = "Resume";
  body.style.backgroundColor = "rgb(186, 73, 73)";
  taskContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";
  timeBtnPause.style.color = "indianred";
}

function resumeCountdownWork() {
  isPaused = false;
  timeBtnPause.innerText = "Pause";
  body.style.backgroundColor = "rgb(186, 73, 73)";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "transparent";
  timeBtnPause.style.color = "white";
}

function pauseCountdownRestingShort() {
  isPaused = true;
  timeBtnPause.innerText = "Resume";
  body.style.backgroundColor = "green";
  taskContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";
  timeBtnPause.style.color = "indianred";
}

function resumeCountdownRestingShort() {
  isPaused = false;
  timeBtnPause.innerText = "Pause";
  body.style.backgroundColor = "green";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "transparent";
  timeBtnPause.style.color = "white";
}


function pauseCountdownRestingLong() {
  isPaused = true;
  timeBtnPause.innerText = "Resume";
  body.style.backgroundColor = "lightblue";
  taskContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";
  timeBtnPause.style.color = "indianred";
}

function resumeCountdownRestingLong() {
  isPaused = false;
  timeBtnPause.innerText = "Pause";
  body.style.backgroundColor = "lightblue";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "transparent";
  timeBtnPause.style.color = "white";
}


//Begining value that is shown on the screen Its below the localStorage because it uses it
countdownDisplay.value = updateTimer(parseInt(timeInput.value * 60));

//Timer code and all the logic about it
function Timer(duration, restDuration, longRestDuration) {
  if (isWorking) {
    updateTimer(duration);
    countdown = setInterval(function () {
      if (!isPaused) {
        duration--;
        updateTimer(duration);
        working();
      }

      if (duration == 0) {
        audio.play();
        clearInterval(countdown);
        isWorking = false;
        preRestingShort();
        updateTimer(restDuration);
      }
    }, 1000);
  } else if (!isWorking) {
    restCountdown = setInterval(function () {
      if (!isPaused) {
        restDuration--;
        restingShort();
        updateTimer(restDuration);
      }

      if (restDuration == 0) {
        audio.play();
        clearInterval(restCountdown);
        isWorking = true;
        preWorking();
        updateTimer(duration);
      }
    }, 1000);
  }
}

function updateTimer(time) {
  countdownDisplay.innerText = formatTime(time);
}

function updatePomodorosCounter() {
  pomodosCounter++;
  sessionStorage.setItem("allPomodorosCounter", pomodosCounter);
  pomodorosCounter.innerText = pomodosCounter;
  taskList.forEach((task) => {
    if (task.isActive) {
      task.donePomodoros++;
      saveTasks();
    }
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

//This renders the Tasks
function renderTask(task) {
  let { id, name, pomodorosToDo, donePomodoros, isActive } = task;

  const taskDiv = document.createElement("div");
  taskDiv.dataset.id = id;
  taskDiv.className = "task";

  let taskContent = document.createElement("div");
  taskContent.className = "task-content";
  taskContent.style.display = "flex";
  taskContent.style.gap = "10px";

  const taskDesc = document.createElement("p");
  taskDesc.innerText = name;

  const taskTime = document.createElement("p");
  taskTime.innerText = `${donePomodoros} / ${pomodorosToDo}`;

  if (isActive) {
    taskDiv.className = "task active";
  }

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "&vellip;";
  deleteButton.id = `button-${Date.now()}`;

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    taskContainer.removeChild(taskDiv);
    taskList = taskList.filter((t) => t.id !== id);
    saveTasks();
  });

  taskDiv.addEventListener("click", () => {
    if (taskDiv.classList.contains("active")) return;

    document
      .querySelectorAll(".task.active")
      .forEach((el) => el.classList.remove("active"));

    taskDiv.classList.add("active");

    taskList.forEach((t) => (t.isActive = false));
    task.isActive = true;

    taskTime.innerText = `${task.donePomodoros} / ${pomodorosToDo}`;
    saveTasks();
  });

  taskContent.append(taskTime, deleteButton);

  taskDiv.append(taskDesc, taskContent);
  taskContainer.appendChild(taskDiv);
}

function addTask() {
  const name = taskInput.value.trim();
  const pomodorosToDo = parseInt(amountOfPomodorosInput.value, 10);

  if (!name || isNaN(pomodorosToDo) || pomodorosToDo <= 0) {
    alert("Please enter a task name and a positive number of Pomodoros.");
    return;
  }

  const newTask = {
    id: `task-${Date.now()}`,
    name,
    pomodorosToDo,
    donePomodoros: 0,
    isActive: false,
  };

  taskList.push(newTask);
  saveTasks();
  renderTask(newTask);

  taskInput.value = "";
  amountOfPomodorosInput.value = "";
}

function updatePomodorosCounterPerTask() {
  taskContainer.innerHTML = "";

  // 2) re‑render each task
  taskList.forEach(renderTask);
}

//================================================================EVENT LISTENERS============================================================//
settings.addEventListener("click", function () {
  settingsScreen.style.display = "block";
  overlay.style.display = "flex";
});

exitSettingsButton.addEventListener("click", function () {
  settingsScreen.style.display = "none";
  overlay.style.display = "none";
});

//This is used to update the display value on input
inputBtn.addEventListener("click", function () {
  const duration = getInput(timeInput.value);
  if (duration !== null) {
    updateTimer(duration);
    settingsScreen.style.display = "none";
    overlay.style.display = "none";
  }
});

//Save input values when Ok is clicked in the settings menu
inputBtn.addEventListener("click", function () {
  localStorage.setItem("timeInput", timeInput.value);
  localStorage.setItem("timeRestInput", timeRestInput.value);
  localStorage.setItem("timeLongRestInput", timeLongRestInput.value);
});

//Starting the timer
timeBtnStart.addEventListener("click", function () {
  Timer(getInput(timeInput.value), getInput(timeRestInput.value));
  if (isWorking) {
    updatePomodorosCounter();
    updatePomodorosCounterPerTask();
  }
});

//Actions that the Fast Foward button does
timeBtnFF.addEventListener("click", function () {
  const duration = getInput(timeInput.value);
  const restDuration = getInput(timeRestInput.value);

  if (isWorking) {
    clearInterval(countdown);
    updateTimer(restDuration);
    preRestingShort();
    isWorking = false;
  } else {
    clearInterval(restCountdown);
    updateTimer(duration);
    preWorking();
    isWorking = true;
  }
});

//Code for pausing

timeBtnPause.addEventListener("click", function () {
  if(isWorking){
  if (isPaused) {
    resumeCountdownWork();
  } else {
    pauseCountdownWork();
  }
  }else{
    if(pomodosCounter % 4 != 0){
      if (isPaused) {
        resumeCountdownRestingShort();
      } else {
        pauseCountdownRestingShort();
      }
    }else{
      if (isPaused) {
        resumeCountdownRestingLong();
      } else {
        pauseCountdownRestingLong();
      }
    }
  }
});

addTaskBtn.addEventListener("click", function () {
  addTaskPanel.style.display = "flex";
  addTaskBtn.style.display = "none";
});

cancelCreation.addEventListener("click", function () {
  addTaskPanel.style.display = "none";
  addTaskBtn.style.display = "block";
});

createTask.addEventListener("click", addTask);

window.addEventListener("DOMContentLoaded", () => {
  taskList.forEach(renderTask);
});

window.addEventListener("DOMContentLoaded", () => {
  pomodorosCounter.innerText = pomodosCounter;
  //Load saved values from local storage
  timeInput.value = localStorage.getItem("timeInput") || 25;
  timeRestInput.value = localStorage.getItem("timeRestInput") || 10;
  timeLongRestInput.value = localStorage.getItem("timeLongRestInput") || 25;
  const initialTime = getInput(timeInput.value);
  if (initialTime) updateTimer(initialTime);
});
