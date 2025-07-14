// --- DOM Elements ---
const body = document.body;
const countdownDisplay = document.getElementById("countdownDisplay");
const title = document.getElementById("title");
const taskContainer = document.getElementById("container-for-tasks");

const longBreakInput = document.getElementById("longBreakTimeInput");
const amountOfPomodorosInput = document.getElementById(
  "amountOfPomodorosInput"
);
const tasks = document.querySelectorAll(".task");
const pomodorosCounter = document.getElementById("pomodorosCounter");


const currentProject = document.getElementById("currentProject");

//  Inputs
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const timeRestInput = document.getElementById("timeRestInput");
const timeLongRestInput = document.getElementById("longBreakTimeInput");
const longBrakeIntervalInput = document.getElementById("longBreakIntervalInput");
const repeatAlarmInput = document.getElementById("repeatAlarmInput");

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

//  Checkboxes
const autoStartBreaksCheck = document.getElementById("autoStartBreaksSlider");
const autoStartPomodorosCheck = document.getElementById("autoStartPomodorosSlider");
const autoCheckTasksCheck = document.getElementById("autoCheckTasks");
const autoSwitchTasksCheck = document.getElementById("autoSwitchTasks");
const darkModeCheck = document.getElementById("darkMode");

// Dropdowns
const alarmSoundsDropDown = document.getElementById("alarmSounds");
const tickingSoundsDropDown = document.getElementById("tickingSounds");
const hourFormatSelection = document.getElementById("hourFormatSelection");

//  Sliders
const alarmVolumeSlider = document.getElementById("alarmVolumeSlider");
const tickingVolumeSlider = document.getElementById("tickingVolumeSlider");
const tickingValue = document.getElementById("tickingValue");

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
let isRestingLong = false;
let numberOfTasks = 0;
let pomodosCounter = parseInt(sessionStorage.getItem("allPomodorosCounter")) || 1;
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
  isWorking = true;
  body.style.backgroundColor = "rgb(186, 73, 73)";
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function working() {
  isWorking = true;
  body.style.backgroundColor = "rgb(186, 73, 73)";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
}

function showWorkDarkModeUI() {
  isWorking = true;
  body.style.backgroundColor = "black";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "none";
  addTaskBtn.style.display = "none";
  title.style.display = "none";
}

function preRestingShort() {
  isWorking = false;
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = "green";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function restingShort() {
  isWorking = false;
  body.style.backgroundColor = "green";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function preRestingLong(){
  isWorking = false;
  isRestingLong = true;
  timeBtnStart.style.display = "block";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = "rgb(57, 112, 151)";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
}

function restingLong(){
  isWorking = false;
  isRestingLong = true;
  body.style.backgroundColor = "rgb(57, 112, 151)";
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
  body.style.backgroundColor = "rgb(57, 112, 151)";
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
  body.style.backgroundColor = "rgb(57, 112, 151)";
  taskContainer.style.display = "block";
  addTaskBtn.style.display = "block";
  title.style.display = "block";
  timeBtnPause.style.background = "transparent";
  timeBtnPause.style.color = "white";
}

function updateRestInterval(){
  if(pomodosCounter % longBrakeIntervalInput.value != 0){
    return false
  }else{
    return true
  }
}


//Begining value that is shown on the screen Its below the localStorage because it uses it
countdownDisplay.value = updateTimer(parseInt(timeInput.value * 60));

//Spliting the timer function into workTimer(), restTimer() and longRestTimer()

function startWorkTimer(duration, restDuration, longRestDuration){
  updateTimer(duration);
    countdown = setInterval(function () {
      if (!isPaused) {
        duration--;
        updateTimer(duration);
        working();
      }

      if (duration == 0 && autoStartBreaksCheck.checked) {
        audio.play();
        clearInterval(countdown);
        isWorking = false;
        if(updateRestInterval()){
          preRestingLong();
          updateTimer(longRestDuration);
          startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value));
        }else{
          preRestingShort();
          updateTimer(restDuration);
          startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value))
        }
      }else if(duration == 0){
        audio.play();
        clearInterval(countdown);
        isWorking = false;
        if(updateRestInterval()){
          preRestingLong();
          updateTimer(longRestDuration);
        }else{
          preRestingShort();
          updateTimer(restDuration);
        }
      }
    }, 1000);
}

function startRestTimer(duration, restDuration, longRestDuration){
  restCountdown = setInterval(function () {
        if (!isPaused) {
          restDuration--;
          restingShort();
          updateTimer(restDuration);
        }

        if (restDuration == 0 && autoStartPomodorosCheck.checked) {
          audio.play();
          clearInterval(restCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
          startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value));
          updatePomodorosCounter();
        }else if(restDuration == 0){
          audio.play();
          clearInterval(restCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
        }
      }, 1000);
}

function startLongRestTimer(duration, restDuration, longRestDuration){
  longRestCountdown = setInterval(function () {
        if (!isPaused) {
          longRestDuration--;
          restingLong();
          updateTimer(longRestDuration);
        }

        if (longRestDuration == 0) {
          audio.play();
          clearInterval(longRestCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
        }
      }, 1000);
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
  let { id, name, pomodorosToDo, donePomodoros, isActive, isChecked } = task;

  const taskDiv = document.createElement("div");
  taskDiv.dataset.id = id;
  taskDiv.className = "task";

  let taskContent = document.createElement("div");
  taskContent.className = "task-content";
  taskContent.style.display = "flex";
  taskContent.style.gap = "10px";

  let taskDonenesAndName = document.createElement("div");
  taskDonenesAndName.style.display = "flex";
  taskDonenesAndName.style.alignItems = "center";
  taskDonenesAndName.style.height = "50px";
  taskDonenesAndName.style.gap = "10px";
  taskDonenesAndName.style.padding = "0px 20px";

  let taskDonenes = document.createElement("label");
  taskDonenes.className = "custom-checkbox"

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${Date.now()}`;

  const checkmark = document.createElement("span");
  checkmark.className = "checkmark";

  const taskDesc = document.createElement("p");
  taskDesc.innerText = name;
  taskDesc.className = "task-description";

  const taskTime = document.createElement("p");
  taskTime.innerText = `${donePomodoros} / ${pomodorosToDo}`;

  if (isActive) {
    taskDiv.className = "task active";
  }

  if(isChecked){
    taskDesc.style.textDecoration = "line-through";
    checkmark.style.backgroundColor = "indianred";
  }

  

  const taskSettingsButton = document.createElement("button");
  taskSettingsButton.innerHTML = "&vellip;";
  taskSettingsButton.className = "task-mod";

  const taskModPanel = document.createElement("div");
  const taskModInputPanel = document.createElement("div");

  const settingsTaskInput = document.createElement("input");
  settingsTaskInput.value = task.name;
  settingsTaskInput.style.display = "none";

  const settingsPomodorosInput = document.createElement("input");
  settingsPomodorosInput.value = task.pomodorosToDo;
  settingsPomodorosInput.type = "number";

  const pomodoroCounterForTaskModificationDiv = document.createElement("p");
  pomodoroCounterForTaskModificationDiv.innerText = donePomodoros;
  
  const modifyingPomodorosToDoContainer = document.createElement("div");
  modifyingPomodorosToDoContainer.className = "modifying-pomodoros-container";

  modifyingPomodorosToDoContainer.append(settingsPomodorosInput,pomodoroCounterForTaskModificationDiv);

  taskModInputPanel.append(settingsTaskInput,modifyingPomodorosToDoContainer);
  taskModInputPanel.style.height = "60%";
  taskModInputPanel.style.display = "flex";
  taskModInputPanel.style.flexDirection = "column";
  taskModInputPanel.style.alignItems = "flex-start";
  taskModInputPanel.style.justifyContent = "space-between"

  const buttonsForManipulationDiv = document.createElement("div");
  const saveAndCancelDiv = document.createElement("div");

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.innerText = "delete";
  deleteTaskBtn.className = "task-mod-buttons";
  const cancelTaskEditBtn = document.createElement("button");
  cancelTaskEditBtn.innerText = "cancel";
  cancelTaskEditBtn.className = "task-mod-buttons";
  const saveTaskEditBtn = document.createElement("button");
  saveTaskEditBtn.innerHTML = "save";
  saveTaskEditBtn.className = "task-mod-buttons-save";

  saveAndCancelDiv.append(cancelTaskEditBtn,saveTaskEditBtn);


  buttonsForManipulationDiv.append(deleteTaskBtn,saveAndCancelDiv);
  buttonsForManipulationDiv.style.display = "flex";
  buttonsForManipulationDiv.style.justifyContent = "space-between";
  buttonsForManipulationDiv.className = "buttons-for-manipulation";

  taskModPanel.append(taskModInputPanel,buttonsForManipulationDiv);
  taskModPanel.style.display = "none";
  taskModPanel.style.width = "100%";
  taskModPanel.style.height = "100%";
  taskModPanel.style.flexDirection = "column";
  taskModPanel.style.justifyContent = "space-between";
  taskModPanel.style.margin = "0px";

  taskSettingsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    taskDiv.style.height = "282px";
    taskDiv.style.width = "455px";
    taskDonenes.style.display = "none";
    settingsTaskInput.style.display = "block";
    taskDesc.style.display = "none"
    taskContent.style.display = "none";
    taskDiv.style.display = "flex";
    taskDiv.style.flexDirection = "column";
    taskDonenesAndName.style.display = "none";
    taskModPanel.style.display = "flex";
    taskDiv.style.padding = "0"
  });

  cancelTaskEditBtn.addEventListener("click", function(e){
    e.stopPropagation();
    taskDiv.style.height = "70px";
    taskDiv.style.flexDirection = "row";
    taskDonenes.style.display = "flex";
    settingsTaskInput.style.display = "none";
    taskDesc.style.display = "flex"
    taskContent.style.display = "flex";
    taskDonenesAndName.style.display = "flex";
    taskModPanel.style.display = "flex";
    taskModPanel.style.display = "none";
  });

  deleteTaskBtn.addEventListener("click", function(e){
    e.stopPropagation();
    taskContainer.removeChild(taskDiv);
    taskList = taskList.filter(t => t.id !== id);
    saveTasks();
  })

  taskDiv.addEventListener("click", () => {
    if (taskDiv.classList.contains("active")) return;

    document.querySelectorAll(".task.active").forEach((el) => el.classList.remove("active"));

    taskDiv.classList.add("active");

    taskList.forEach((t) => (t.isActive = false));
    task.isActive = true;
    currentProject.innerText = task.name;
    localStorage.setItem("currentProject", currentProject.innerText)
    taskTime.innerText = `${task.donePomodoros} / ${pomodorosToDo}`;
    saveTasks();
  });

  checkbox.addEventListener("click", function(e){
    e.stopPropagation();
    if(taskDesc.style.textDecoration === "line-through"){
      taskDesc.style.textDecoration = "none";
      task.isChecked = false;
    }else{
      taskDesc.style.textDecoration = "line-through";
      task.isChecked = true;
    }
    saveTasks();
  });

  taskDonenes.addEventListener("click", function(e){
    e.stopPropagation();
  })


  taskContent.append(taskTime, taskSettingsButton);

  taskDonenes.append(checkbox, checkmark)

  taskDonenesAndName.append(taskDonenes, taskDesc);

  taskDiv.append(taskDonenesAndName, taskContent, taskModPanel);

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
    isChecked:false
  };

  taskList.push(newTask);
  saveTasks();
  renderTask(newTask);

  taskInput.value = "";
  amountOfPomodorosInput.value = "1";
}

function updatePomodorosCounterPerTask() {
  taskContainer.innerHTML = "";

  // 2) re‑render each task
  taskList.forEach(renderTask);
}

function taskCompletionCheck(){
   taskList.forEach(task => {
    if(autoCheckTasksCheck.checked && task.donePomodoros >= task.pomodorosToDo -1 && task.isActive){
      task.isChecked = true;
      if(autoSwitchTasksCheck.checked){
        task.isActive = false;
        task.className = "task"
      }
    }
    saveTasks();
  });

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

//  Save input values when Ok is clicked in the settings menu
inputBtn.addEventListener("click", function () {
  settingsScreen.style.display = "none";
  overlay.style.display = "none";

  //  Inputs
  localStorage.setItem("timeInput", timeInput.value);
  localStorage.setItem("timeRestInput", timeRestInput.value);
  localStorage.setItem("timeLongRestInput", timeLongRestInput.value);
  localStorage.setItem("longBrakeIntervalInput", longBrakeIntervalInput.value);
  localStorage.setItem("repeatAlarmInput", repeatAlarmInput.value);

  //  Checkboxes
  localStorage.setItem("autoStartBreaksSlider", autoStartBreaksCheck.checked);
  localStorage.setItem("autoStartPomodorosSlider", autoStartPomodorosCheck.checked);
  localStorage.setItem("autoCheckTasks", autoCheckTasksCheck.checked);
  localStorage.setItem("autoSwitchTasks", autoSwitchTasksCheck.checked);
  localStorage.setItem("darkMode", darkModeCheck.checked);

  // Dropdowns
  localStorage.setItem("alarmSounds", alarmSoundsDropDown.value);
  localStorage.setItem("tickingSounds", tickingSoundsDropDown.value);
  localStorage.setItem("hourFormatSelection", hourFormatSelection.value);

  //  Sliders
  localStorage.setItem("alarmVolumeSlider", alarmVolumeSlider.value);
  localStorage.setItem("tickingVolumeSlider", tickingVolumeSlider.value);
  localStorage.setItem("tickingValue", tickingVolumeSlider.value);

  if(isWorking){
    updateTimer(getInput(localStorage.getItem("timeInput")));
  }
});

//  Starting the timer
timeBtnStart.addEventListener("click", function () {
  if (isWorking) {
    updatePomodorosCounter();
    startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value));
  }else if(updateRestInterval() || isRestingLong){
    startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
  }else{
    startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(longBreakInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
  }
});

//  Actions that the Fast Foward button does
timeBtnFF.addEventListener("click", function () {
  const duration = getInput(timeInput.value);
  const restDuration = getInput(timeRestInput.value);
  const longRestDuration = getInput(timeLongRestInput.value);
  if (isWorking) {
    clearInterval(countdown);
    if(updateRestInterval()){
      updateTimer(longRestDuration);
      preRestingLong();
    }else{
      updateTimer(restDuration);
      preRestingShort();
    }
    isWorking = false;
  } else {
    if(updateRestInterval()){
      clearInterval(longRestCountdown);
      updateTimer(duration);
      preWorking();
      isWorking = true;
      isRestingLong = false;
    }else{
      clearInterval(restCountdown);
      updateTimer(duration);
      preWorking();
      isWorking = true;
    }
  }
  saveTasks()
});

//  Code for pausing

timeBtnPause.addEventListener("click", function () {
  if(isWorking){
  if (isPaused) {
    resumeCountdownWork();
  } else {
    pauseCountdownWork();
  }
  }else{
    if(updateRestInterval()){
      if (isPaused) {
        resumeCountdownRestingLong();
      } else {
        pauseCountdownRestingLong();
      }
    }else{
      if (isPaused) {
        resumeCountdownRestingShort();
      } else {
        pauseCountdownRestingShort();
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

workModeBtn.addEventListener('click', function(){
  isRestingLong = false;
  if(isWorking){
    clearInterval(countdown)
    updateTimer(getInput(timeInput.value))
    preWorking();
  }else if(!isWorking){
    clearInterval(restCountdown);
    clearInterval(longRestCountdown);
    updateTimer(getInput(timeInput.value))
    preWorking();
  }
});

shortBrakeModeBtn.addEventListener('click',function(){
  isRestingLong = false;
  if(isWorking){
    clearInterval(countdown)
    updateTimer(getInput(timeRestInput.value))
    preRestingShort();
  }else if(!isWorking){
    clearInterval(restCountdown);
    clearInterval(longRestCountdown);
    updateTimer(getInput(timeRestInput.value))
    preRestingShort();
  }
});

longBrakeModeBtn.addEventListener('click', function(){
  isRestingLong = true;
  if(isWorking){
    clearInterval(countdown)
    updateTimer(getInput(longBreakInput.value))
    preRestingLong();
  }else if(!isWorking){
    clearInterval(restCountdown);
    clearInterval(longRestCountdown);
    updateTimer(getInput(longBreakInput.value))
    preRestingLong();
  }
});

tickingVolumeSlider.oninput = function(){
  tickingValue.innerText = this.value;
  localStorage.setItem("tickingValue", this.value);
}

window.addEventListener("DOMContentLoaded", () => {
  pomodorosCounter.innerText = pomodosCounter;
  //Load saved values from local storage 

  //  Inputs
  timeInput.value = localStorage.getItem("timeInput") || 25;
  timeRestInput.value = localStorage.getItem("timeRestInput") || 10;
  timeLongRestInput.value = localStorage.getItem("timeLongRestInput") || 25;
  longBrakeIntervalInput.value = localStorage.getItem("longBrakeIntervalInput") || 4;
  currentProject.innerText = localStorage.getItem("currentProject") || "untitled";
  repeatAlarmInput.value = localStorage.getItem("repeatAlarmInput") || 1;

  //  Checkboxes
  if(localStorage.getItem("autoStartBreaksSlider") === "true"){
    autoStartBreaksCheck.checked = true;
  }else{
    autoStartBreaksCheck.checked = false;
  }

  if(localStorage.getItem("autoStartPomodorosSlider") === "true" ){
    autoStartPomodorosCheck.checked = true;
  }else{
    autoStartPomodorosCheck.checked = false;
  }

  if(localStorage.getItem("autoCheckTasks") === "true" ){
    autoCheckTasksCheck.checked = true;
  }else{
    autoCheckTasksCheck.checked = false;
  }

  if(localStorage.getItem("autoSwitchTasks") === "true" ){
    autoSwitchTasksCheck.checked = true;
  }else{
    autoSwitchTasksCheck.checked = false;
  }

  if(localStorage.getItem("darkMode") === "true" ){
    darkModeCheck.checked = true;
  }else{
    darkModeCheck.checked = false;
  }

  //  Dropdowns
  alarmSoundsDropDown.value = localStorage.getItem("alarmSounds") || "kitchen";
  tickingSoundsDropDown.value = localStorage.getItem("tickingSounds") || "none";
  hourFormatSelection.value = localStorage.getItem("hourFormatSelection") || "24-hour" ;

  //  Sliders
  alarmVolumeSlider.value = localStorage.getItem("alarmVolumeSlider");
  tickingVolumeSlider.value = localStorage.getItem("tickingVolumeSlider");
  tickingValue.innerText = localStorage.getItem("tickingValue") || 50;

  //On-start
  const initialTime = getInput(timeInput.value);
  if (initialTime) updateTimer(initialTime);
  taskList.forEach(renderTask);
});
