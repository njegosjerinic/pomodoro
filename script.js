// --- DOM Elements ---
const body = document.body;
const timerBackground = document.querySelector(".timer-background");
const countdownDisplay = document.getElementById("countdownDisplay");
const smallCountdownDisplay = document.getElementById("smallCountdownDisplay");
const title = document.getElementById("title");
const taskContainer = document.getElementById("container-for-tasks");

const amountOfPomodorosInput = document.getElementById("amountOfPomodorosInput");
const tasks = document.querySelectorAll(".task");
const pomodorosCounter = document.getElementById("pomodorosCounter");
const estimatedPomodorosContainer = document.querySelector(  ".estimatedPomodorosContainer");
const acumulatedPomodorosView = document.querySelector(".acumulatedPomodoros");
const acumulatedPomodorosDoneView = document.querySelector(".acumulatedPomodorosDone");
const timeOfFinishingWork = document.querySelector(".timeOfFinishingWork");
const currentProject = document.getElementById("currentProject");
const progressBar = document.querySelector(".pomodoor-progress");
const progressToCompletion = document.querySelector(".progress");


//  Inputs
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
window.timeInput = timeInput;
const timeRestInput = document.getElementById("timeRestInput");
window.timeRestInput = timeRestInput;
const timeLongRestInput = document.getElementById("longBreakTimeInput");
window.timeLongRestInput = timeLongRestInput;
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
const workingColor = document.getElementById("workingColor");
const shortBrakeColor = document.getElementById("shortbreakColor");
const longBrakeColor = document.getElementById("longbreakColor");
const generalTaskSettings = document.getElementById("generalTaskSettings");
const clearFinishedTasks = document.getElementById("clearFinishedTasks");
const clearAllTasks = document.getElementById("clearAllTasks");
const smallWindowOpenBtn = document.getElementById("smallWindowOpenBtn");

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
const alarmValue = document.getElementById("alarmValue");
const tickingVolumeSlider = document.getElementById("tickingVolumeSlider");
const tickingValue = document.getElementById("tickingValue");

// Panels and Screens
const settingsScreen = document.querySelector(".settings-screen");
const addTaskPanel = document.getElementById("addTaskPanel");
const overlay = document.getElementById("overlay");
const colorSelector = document.querySelector(".color-selector");
const colorSelectorContainer = document.querySelector(".color-selector-container");
const generalTaskSettingsScreen = document.querySelector(".generalTaskSettingsScreen");
generalTaskSettingsScreen.style.display = "none";

// Audios for alarm
const kitchenAudio = new Audio("audiomass-output.mp3");
const bellAudio = new Audio("bellAudio.mp3");

// Audios for ticking
const slowTickingSound = new Audio("usedSlowClock.mp3");
const fastTickingSound = new Audio("usedFastClock.mp3");

// Clicking start
const startingCLick = new Audio("clickingStart.wav")

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
let colorSelectorMode = null;
let acumulatedPomodoros = 0;
let acumulatedPomodorosDone = 0;

//==============UTILITIES==================//
//This takes input that has been translated to seconds and translates it back to minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  smallCountdownDisplay.innerText = `${minutes < 10 ? "0" : ""}${minutes}`;

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
  body.style.backgroundColor = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  timeBtnStart.style.display = "block";
  timeBtnStart.style.color = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  taskContainer.style.display = "flex";
  workModeBtn.style.backgroundColor = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
}

function working() {
  isWorking = true;
  body.style.backgroundColor = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  timeBtnStart.style.display = "none";
  timeBtnStart.style.color = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  timeBtnPause.style.color = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  taskContainer.style.display = "block";
  title.style.display = "flex";
  workModeBtn.style.backgroundColor = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  estimatedPomodorosContainer.style.display = "flex";
  
}

function showWorkDarkModeUI() {
  isWorking = true;
  body.style.backgroundColor = "black";
  timeBtnStart.style.display = "none";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "none";
  title.style.display = "none";
  estimatedPomodorosContainer.style.display = "none";
  addTaskBtn.style.display = "none";
  workModeBtn.style.display = "none";
  shortBrakeModeBtn.style.display = "none";
  longBrakeModeBtn.style.display = "none";
  timerBackground.style.background = "transparent";
  timeBtnPause.style.background = "transparent";
  timeBtnPause.style.color = "white";
}

function preRestingShort() {
  isWorking = false;
  timeBtnStart.style.display = "block";
  timeBtnStart.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = localStorage.getItem("shortBrakeColor") || "green";
  taskContainer.style.display = "block";
  shortBrakeModeBtn.style.backgroundColor = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  workModeBtn.style.backgroundColor = "transparent";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
}

function restingShort() {
  isWorking = false;
  body.style.backgroundColor = localStorage.getItem("shortBrakeColor") || "green";
  timeBtnStart.style.display = "none";
  timeBtnStart.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  shortBrakeColor.style.backgroundColor = localStorage.getItem("shortBrakeColor") || "rgba(40, 104, 40, 1)";
  workModeBtn.style.backgroundColor = "transparent";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  shortBrakeModeBtn.style.backgroundColor = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
}

function preRestingLong(){
  isWorking = false;
  isRestingLong = true;
  timeBtnStart.style.display = "block";
  timeBtnStart.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timeBtnFF.style.display = "none";
  timeBtnPause.style.display = "none";
  body.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  taskContainer.style.display = "block";
  longBrakeModeBtn.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  workModeBtn.style.backgroundColor = "transparent";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
}

function restingLong(){
  isWorking = false;
  isRestingLong = true;
  body.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timeBtnStart.style.display = "none";
  timeBtnStart.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timeBtnFF.style.display = "block";
  timeBtnPause.style.display = "block";
  taskContainer.style.display = "block";
  longBrakeColor.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  workModeBtn.style.backgroundColor = "transparent";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.backgroundColor = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
}



//States that have to do with pausing
function pauseCountdownWork() {
  isPaused = true;
  timeBtnPause.innerText = "START";
  localStorage.getItem("workingColor") ? body.style.backgroundColor = localStorage.getItem("workingColor") : body.style.backgroundColor = "rgb(186, 73, 73)";
  taskContainer.style.display = "flex";
  title.style.display = "flex";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";
  timeBtnPause.style.color ? body.style.backgroundColor = localStorage.getItem("workingColor") : body.style.backgroundColor = "rgb(186, 73, 73)";
  timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px"
  timeBtnFF.style.display = "none";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
}

function resumeCountdownWork() {
  isPaused = false;
  timeBtnPause.innerText = "PAUSE";
  localStorage.getItem("workingColor") ? body.style.backgroundColor = localStorage.getItem("workingColor") : body.style.backgroundColor = "rgb(186, 73, 73)";
  taskContainer.style.display = "block";
  title.style.display = "flex";
  if(darkModeCheck.checked){
    timeBtnPause.style.background = "transparent";
    timeBtnPause.style.color = "white";
  }else{
    timeBtnPause.style.background = "white";
    timeBtnPause.style.color ? body.style.backgroundColor = localStorage.getItem("workingColor") : body.style.backgroundColor = "rgb(186, 73, 73)";
  }
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  timeBtnPause.style.boxShadow = " 0px 0px 0px"
}

function pauseCountdownRestingShort() {
  isPaused = true;
  timeBtnPause.innerText = "START";
  taskContainer.style.display = "flex";
  title.style.display = "flex";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  timeBtnFF.style.display = "none";
}

function resumeCountdownRestingShort() {
  isPaused = false;
  timeBtnPause.innerText = "PAUSE";
  taskContainer.style.display = "block";
  title.style.display = "flex";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  timeBtnPause.style.boxShadow = " 0px 0px 0px";
  timeBtnFF.style.display = "block";
}


function pauseCountdownRestingLong() {
  isPaused = true;
  timeBtnPause.innerText = "START";
  taskContainer.style.display = "flex";
  title.style.display = "flex";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.borderRadius = "5px";

  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  timeBtnFF.style.display = "none";
}

function resumeCountdownRestingLong() {
  isPaused = false;
  timeBtnPause.innerText = "PAUSE";
  taskContainer.style.display = "block";
  title.style.display = "flex";
  estimatedPomodorosContainer.style.display = "flex";
  addTaskBtn.style.display = "block";
  workModeBtn.style.display = "block";
  shortBrakeModeBtn.style.display = "block";
  longBrakeModeBtn.style.display = "block";
  timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  timeBtnPause.style.background = "white";
  timeBtnPause.style.color = localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  timeBtnPause.style.boxShadow = " 0px 0px 0px"
  timeBtnFF.style.display = "block";
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

window.startWorkTimer = function(duration, restDuration, longRestDuration){
  timeBtnPause.innerText = "PAUSE";
  updateTimer(duration);
    countdown = setInterval(function () {
      if (!isPaused) {
        duration--;
        updateTimer(duration);
        darkModeCheck.checked ? showWorkDarkModeUI() :  working();
        tickingSoundMod();
        progressBarUpdate(duration,getInput(timeInput.value));
        localStorage.setItem("countdown", duration);
        localStorage.setItem("isWorking", isWorking);
      }

      if (duration == 0 && autoStartBreaksCheck.checked) {
        alarmSoundSelector();
        clearInterval(countdown);
        isWorking = false;
        workModeBtn.style.backgroundColor = "transparent";
        if(updateRestInterval()){
          preRestingLong();
          updateTimer(longRestDuration);
          startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
        }else{
          preRestingShort();
          updateTimer(restDuration);
          startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value))
        }
        progressToCompletion.style.width = "0%";
      }else if(duration == 0){
        alarmSoundSelector();
        clearInterval(countdown);
        isWorking = false;
        if(updateRestInterval()){
          preRestingLong();
          updateTimer(longRestDuration);
        }else{
          preRestingShort();
          updateTimer(restDuration);
        }
        progressToCompletion.style.width = "0%";
      }
    }, 1000);
    
}

window.startRestTimer = startRestTimer;

function startRestTimer(duration, restDuration, longRestDuration){
  restCountdown = setInterval(function () {
        if (!isPaused) {
          restDuration--;
          restingShort();
          updateTimer(restDuration);
          progressBarUpdate(restDuration,getInput(timeRestInput.value));
          localStorage.setItem("restCountdown", restDuration);
          localStorage.setItem("isWorking", isWorking);
        }

        if (restDuration == 0 && autoStartPomodorosCheck.checked) {
          alarmSoundSelector();
          clearInterval(restCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
          startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
          updatePomodorosCounter();
          shortBrakeModeBtn.style.backgroundColor = "transparent";
          workModeBtn.style.backgroundColor = "transparent";
          progressToCompletion.style.width = "0%";
        }else if(restDuration == 0){
          alarmSoundSelector();
          clearInterval(restCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
          progressToCompletion.style.width = "0%";
          shortBrakeModeBtn.style.backgroundColor = "transparent";
        }
      }, 1000);
}

window.startLongRestTimer = startLongRestTimer

function startLongRestTimer(duration, restDuration, longRestDuration){
  longRestCountdown = setInterval(function () {
        if (!isPaused) {
          longRestDuration--;
          restingLong();
          updateTimer(longRestDuration);
          progressBarUpdate(longRestDuration,getInput(timeLongRestInput.value));
          localStorage.setItem("longRestCountdown", longRestDuration);
          localStorage.setItem("isWorking", isWorking);
        }

        if (longRestDuration == 0) {
          alarmSoundSelector()
          clearInterval(longRestCountdown);
          isWorking = true;
          preWorking();
          updateTimer(duration);
          progressToCompletion.style.width = "0%";
          longBrakeModeBtn.style.backgroundColor = "transparent";
          shortBrakeModeBtn.style.backgroundColor = "transparent";  
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

function createElement(tag, className = "",style = {}){
  const el = document.createElement(tag);
  el.className = className;
  Object.assign(el.style, style);
  return el
}

//This renders the Tasks
function renderTask(task) {
  let { id, name, pomodorosToDo, donePomodoros, isActive, isChecked } = task;

  const taskDiv = createElement("div", "task");
  taskDiv.dataset.id = id;

  let taskContent = createElement("div", "task-content", {display : "flex", gap : "10px"});
  taskContent.className = "task-content";

  let taskDonenesAndName = createElement("div", "task-donenes-and-name", {display : "flex", alignItems : "center", height : "50px", gap : "10px", padding : "0px 20px"});

  let taskDonenes = createElement("label", "custom-checkbox");


  const checkbox = createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${Date.now()}`;

  const checkmark = createElement("span", "checkmark");

  const taskDesc = createElement("p", "task-description");
  taskDesc.innerText = name;

  const taskTime = document.createElement("p");
  taskTime.innerText = `${donePomodoros} / ${pomodorosToDo}`;
  acumulatedPomodorosDoneView.innerText = acumulatedPomodorosDone + donePomodoros;
  localStorage.setItem("acumulatedPomodorosDone", acumulatedPomodorosDone);


  if (isActive) {
    taskDiv.className = "task active";
  }

  if(isChecked && autoSwitchTasksCheck.checked){

    taskDesc.style.textDecoration = "line-through";
    checkmark.style.backgroundColor = "indianred";
  }else if(isChecked){
    taskDesc.style.textDecoration = "line-through";
    checkmark.style.backgroundColor = "indianred";
  }


  const taskSettingsButton = createElement("button");
  taskSettingsButton.innerHTML = "&vellip;";
  taskSettingsButton.className = "task-mod";

  const taskModPanel = createElement("div");
  const taskModInputPanel = createElement("div");

  const settingsTaskInput = createElement("input");
  settingsTaskInput.value = task.name;
  settingsTaskInput.style.fontSize = "x-large";
  settingsTaskInput.style.border = "none";
  settingsTaskInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  settingsTaskInput.style.display = "none";

  const settingsPomodorosInput = createElement("input");
  settingsPomodorosInput.value = task.pomodorosToDo;
  settingsPomodorosInput.type = "number";

  const pomodoroCounterForTaskModificationDiv = createElement("p");
  pomodoroCounterForTaskModificationDiv.innerText = donePomodoros;
  
  const modifyingPomodorosToDoContainer = createElement("div");
  modifyingPomodorosToDoContainer.className = "modifying-pomodoros-container";

  modifyingPomodorosToDoContainer.append(settingsPomodorosInput,pomodoroCounterForTaskModificationDiv);

  taskModInputPanel.append(settingsTaskInput,modifyingPomodorosToDoContainer);
  taskModInputPanel.style.height = "60%";
  taskModInputPanel.style.display = "flex";
  taskModInputPanel.style.flexDirection = "column";
  taskModInputPanel.style.alignItems = "flex-start";
  taskModInputPanel.style.gap = "50px"
  taskModInputPanel.style.padding = "20px";

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

  saveTaskEditBtn.addEventListener("click", function(e){
    e.stopPropagation();
    taskDesc.innerText = settingsTaskInput.value;
    task.name = settingsTaskInput.value;
    task.pomodorosToDo = parseInt(settingsPomodorosInput.value, 10);
    pomodoroCounterForTaskModificationDiv.innerText = task.donePomodoros;
    settingsPomodorosInput.value = task.pomodorosToDo;
    taskTime.innerText = `${task.donePomodoros} / ${task.pomodorosToDo}`;;
    acumulatedPomodorosView.innerText =  acumulatedPomodoros + settingsPomodorosInput.value;
    localStorage.setItem("acumulatedPomodoros", acumulatedPomodoros);
    taskDiv.style.height = "70px";
    taskDiv.style.flexDirection = "row";
    taskDonenes.style.display = "flex";
    settingsTaskInput.style.display = "none";
    taskDesc.style.display = "flex";
    taskContent.style.display = "flex";
    taskModPanel.style.display = "none";
    taskDonenesAndName.style.display = "flex";
    localStorage.setItem("tasks", JSON.stringify(taskList));
    updatePomodoroSummary();
  });

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
    taskDiv.style.width = "480px";
    taskDonenes.style.display = "none";
    settingsTaskInput.style.display = "block";
    taskDesc.style.display = "none"
    taskContent.style.display = "none";
    taskDiv.style.display = "flex";
    taskDiv.style.flexDirection = "column";
    taskDonenesAndName.style.display = "none";
    taskModPanel.style.display = "flex";
    taskDiv.style.padding = "0";
    settingsTaskInput.focus();
    settingsTaskInput.setSelectionRange(settingsTaskInput.value.length, settingsTaskInput.value.length);
    settingsTaskInput.style.outline = "none";
    taskDiv.style.border = "0";
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
    if (task.isActive) {
      taskDiv.style.borderLeft = "5px solid black";
    }
  });

  deleteTaskBtn.addEventListener("click", function(e){
    e.stopPropagation();
    taskContainer.removeChild(taskDiv);
    taskList = taskList.filter(t => t.id !== id);
    saveTasks();
    if(acumulatedPomodoros >= 0){
    acumulatedPomodoros -= pomodorosToDo;
    }else{
      acumulatedPomodoros = 1;
    }
    updatePomodoroSummary();
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
  updatePomodoroSummary();
}

function addTask() {
  const name = taskInput.value.trim();
  const pomodorosToDo = parseInt(amountOfPomodorosInput.value, 10);

  acumulatedPomodoros += pomodorosToDo;
  acumulatedPomodorosView.innerText = acumulatedPomodoros;
  localStorage.setItem("acumulatedPomodoros", acumulatedPomodoros);
  const finishTimestamp = Date.now() + acumulatedPomodoros * getInput(timeInput.value) * 1000;
  const finishTime = new Date(finishTimestamp);
  timeOfFinishingWork.innerText = finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: is24HourFormat() });
  localStorage.setItem("timeOfFinishingWork", timeOfFinishingWork.innerText);


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
    isChecked:false,
  };

  taskList.push(newTask);
  saveTasks();
  renderTask(newTask);

  taskInput.value = "";
  amountOfPomodorosInput.value = "1";
  updatePomodoroSummary();
}

function updatePomodorosCounterPerTask() {
  taskContainer.innerHTML = "";

  // 2) re‑render each task
  taskList.forEach(renderTask);
}

function taskCompletionCheck() {
  for (let index = 0; index < taskList.length; index++) {
    const task = taskList[index];
    const nextTask = taskList.every(task => task.isChecked) ? null : taskList[0];

    if (
      autoCheckTasksCheck.checked &&
      task.donePomodoros >= task.pomodorosToDo - 1 &&
      task.isActive
    ) {
      task.isChecked = true;

      if (autoSwitchTasksCheck.checked) {
        task.isActive = false;
        if (nextTask) {
          nextTask.isActive = true;
        }

        if (taskList.length >= 2) {
          taskList.splice(index, 1);      // Remove from current position
          taskList.push(task);            // Move to the end
        }
      }
    }
  }
  updatePomodoroSummary();
  saveTasks();
}

function alarmSoundSelector(){
  if(alarmSoundsDropDown.value === 'kitchen'){
    for(let i = 0; i < repeatAlarmInput.value; i++){
      kitchenAudio.play();
    } 
    kitchenAudio.volume = alarmVolumeSlider.value / 100;
  }else{
    for(let i = 0; i < repeatAlarmInput.value; i++){
      bellAudio.play();
    }
    bellAudio.volume = alarmVolumeSlider.value / 100;
  }
}

function tickingSoundMod(){
  if(tickingSoundsDropDown.value === "ticking-fast"){
    fastTickingSound.play();
    fastTickingSound.volume = tickingVolumeSlider.value / 100;
  }else if(tickingSoundsDropDown.value === "ticking-slow"){
    slowTickingSound.play();
    slowTickingSound.volume = tickingVolumeSlider.value / 100;
  }else if(tickingSoundsDropDown.value === "none"){
    fastTickingSound.pause();
    slowTickingSound.pause();
  }
}

function toggleColorSelector(){
  if (colorSelector.style.display === "none" || colorSelector.style.display === "") {
    colorSelector.style.display = "block";
    colorSelectorContainer.style.display = "flex";
    colorSelectorContainer.style.flexDirection = "column";
  } else {
    colorSelector.style.display = "none";
    colorSelectorContainer.style.display = "none";
  }
}

function colorSelectorDivs(button) {
  const color = button.dataset.color;
  if (colorSelectorMode === "working") {
    localStorage.setItem("workingColor", color);
    workingColor.style.backgroundColor = color;
    if(isWorking){
      body.style.backgroundColor = color;
      workModeBtn.style.backgroundColor = color;
      shortBrakeModeBtn.style.backgroundColor = "transparent";
      longBrakeModeBtn.style.backgroundColor = "transparent";
    }
  } else if (colorSelectorMode === "shortBrake") {
    localStorage.setItem("shortBrakeColor", color);
    shortBrakeColor.style.backgroundColor = color;
    if(!isWorking && !isRestingLong){
    body.style.backgroundColor = color;
    shortBrakeModeBtn.style.backgroundColor = color;
    workModeBtn.style.backgroundColor = "transparent";
    longBrakeModeBtn.style.backgroundColor = "transparent";
    }
  } else if (colorSelectorMode === "longBrake") {
    localStorage.setItem("longBrakeColor", color);
    longBrakeColor.style.backgroundColor = color;
    if(!isWorking && isRestingLong){
      body.style.backgroundColor = color;
      longBrakeModeBtn.style.backgroundColor = color;
      workModeBtn.style.backgroundColor = "transparent";
      shortBrakeModeBtn.style.backgroundColor = "transparent";
    }
  }
}

function is24HourFormat() {
  return hourFormatSelection.value !== "24-hour";
}

function updatePomodoroSummary() {
    acumulatedPomodorosView.innerText = acumulatedPomodoros;

    const finishTimestamp = Date.now() + acumulatedPomodoros * getInput(timeInput.value) * 1000;
    const finishTime = new Date(finishTimestamp);

    timeOfFinishingWork.innerText = finishTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: is24HourFormat()
    });

    localStorage.setItem("timeOfFinishingWork", timeOfFinishingWork.innerText);
    localStorage.setItem("acumulatedPomodoros", acumulatedPomodoros);
}

function progressBarUpdate(remeaningTime, totalTime){
  const percent = 100 - ((remeaningTime / totalTime) * 100);
  progressToCompletion.style.width = `${percent}%`;
}

function clickStartButton(){
  timeBtnStart.style.boxShadow = "0px 0px 0px";
}

window.startMainTimer = function () {
  timeBtnStart.click();
};

//================================================================EVENT LISTENERS============================================================//
let miniWindow = null;

function openMini() {
  miniWindow = window.open("mini.html", "Mini", "width=200,height=1000");
}

smallWindowOpenBtn.addEventListener("click", openMini)


settings.addEventListener("click", function () {
  settingsScreen.style.display = "block";
  overlay.style.display = "flex";
});

exitSettingsButton.addEventListener("click", function () {
  settingsScreen.style.display = "none";
  overlay.style.display = "none";
});

colorSelectorContainer.addEventListener("click", function (event) {
  event.stopPropagation();
  if(colorSelectorContainer.contains(event.target)){
    colorSelector.style.display = "none";
    colorSelectorContainer.style.display = "none";
    settingsScreen.style.display = "block";
    overlay.style.alignItems = "flex-start";
    colorSelectorMode = null;
  }
});

overlay.addEventListener("click", function(event){
  event.stopPropagation();
  if(!settingsScreen.contains(event.target)){
    settingsScreen.style.display = "none";
    overlay.style.display = "none";
    colorSelector.style.display = "none";
    colorSelectorContainer.style.display = "none";
  }
})

// Color selector
workingColor.addEventListener("click", function () { 
  document.getElementById("colorTitleUse").innerText = "Pomodoro";
  toggleColorSelector();
  settingsScreen.style.display = "none";
  overlay.style.alignItems = "center";
  colorSelectorMode = "working";
});

shortBrakeColor.addEventListener("click", function () { 
  document.getElementById("colorTitleUse").innerText = "Short Break";
  toggleColorSelector();
  settingsScreen.style.display = "none";
  overlay.style.alignItems = "center";
  colorSelectorMode = "shortBrake";
});

longBrakeColor.addEventListener("click", function () { 
  document.getElementById("colorTitleUse").innerText = "Long Break";
  toggleColorSelector();
  settingsScreen.style.display = "none";
  overlay.style.alignItems = "center";
  colorSelectorMode = "longBrake";
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
  localStorage.setItem("alarmValue", alarmVolumeSlider.value);
  localStorage.setItem("tickingVolumeSlider", tickingVolumeSlider.value);
  localStorage.setItem("tickingValue", tickingVolumeSlider.value);

  if(isWorking){
    updateTimer(getInput(localStorage.getItem("timeInput")));
  }

  updatePomodoroSummary();
});

//  Starting the timer
timeBtnStart.addEventListener("click", function () {
  timeBtnStart.disabled = true;
  if (isWorking) {
    updatePomodorosCounter();
    startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }else if(updateRestInterval() || isRestingLong){
    startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }else{
    startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }
  startingCLick.play();
});
if(miniWindow){
document.getElementById("timeBtnStartMini").addEventListener("click", function(){
    timeBtnStart.disabled = true;
  if (isWorking) {
    updatePomodorosCounter();
    startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startWorkTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }else if(updateRestInterval() || isRestingLong){
    startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }else{
    startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
    if(miniWindow){
      miniWindow.startRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    }
  }
  startingCLick.play();
})
}

//  Actions that the Fast Foward button does
timeBtnFF.addEventListener("click", function () {
  const duration = getInput(timeInput.value);
  const restDuration = getInput(timeRestInput.value);
  const longRestDuration = getInput(timeLongRestInput.value);

  progressToCompletion.style.width = "0%";

  isRestingLong = updateRestInterval(); // Always update this dynamically

  if (isWorking) {
    clearInterval(countdown);
    localStorage.setItem("countdown", duration);
    isWorking = false;
    localStorage.setItem("isWorking", isWorking);

    if (isRestingLong) {
      updateTimer(longRestDuration);
      localStorage.setItem("longRestCountdown", longRestDuration);
      preRestingLong();
      workModeBtn.style.backgroundColor = "transparent";
    } else {
      updateTimer(restDuration);
      localStorage.setItem("restCountdown", restDuration);
      preRestingShort();
    }

  } else {
    if (isRestingLong) {
      clearInterval(longRestCountdown);
      updateTimer(duration);
      localStorage.setItem("countdown", duration);
      preWorking();
      isWorking = true;
      isRestingLong = false;
      localStorage.setItem("isWorking", isWorking);
      localStorage.setItem("isRestingLong", isRestingLong);
      longBrakeModeBtn.style.backgroundColor = "transparent";
    } else {
      clearInterval(restCountdown);
      updateTimer(duration);
      localStorage.setItem("countdown", duration);
      preWorking();
      isWorking = true;
      localStorage.setItem("isWorking", isWorking);
      shortBrakeModeBtn.style.backgroundColor = "transparent";
    }
  }
  timeBtnStart.disabled = false;
  timeBtnStart.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  saveTasks();
});


//  Code for pausing

timeBtnPause.addEventListener("click", function () {
  if(isWorking){
  if (isPaused) {
    resumeCountdownWork();
    if(miniWindow){
      miniWindow.resumeCountdownWork();
      miniWindow.console.log("works")
    }
    startingCLick.play();
  } else {
    pauseCountdownWork();
    if(miniWindow){
      miniWindow.pauseCountdownWork();
    }
  }
  }else{
    if(updateRestInterval()){
      if (isPaused) {
        resumeCountdownRestingLong();
        startingCLick.play();
        if(miniWindow){
          miniWindow.resumeCountdownRestingLong();
        }
      } else {
        pauseCountdownRestingLong();
        if(miniWindow){
          miniWindow.pauseCountdownRestingLong();
        }
      }
    }else{
      if (isPaused) {
        resumeCountdownRestingShort();
        startingCLick.play();
        if(miniWindow){
          miniWindow.resumeCountdownRestingShort();
        }
      } else {
        pauseCountdownRestingShort();
        if(miniWindow){
          miniWindow.pauseCountdownRestingShort();
        }
      }
    }
  }
});

addTaskBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  addTaskPanel.style.display = "flex";
  addTaskBtn.style.display = "none";
});

cancelCreation.addEventListener("click", function () {
  addTaskPanel.style.display = "none";
  addTaskBtn.style.display = "block";
});

createTask.addEventListener("click", addTask);

document.addEventListener("click", function (event) {
  if (!addTaskPanel.contains(event.target) && addTaskPanel.style.display === "flex") {
    addTaskPanel.style.display = "none";
    addTaskBtn.style.display = "block";
  }
});



workModeBtn.addEventListener('click', function(){
  isRestingLong = false;
  shortBrakeModeBtn.style.backgroundColor = "transparent";
  longBrakeModeBtn.style.backgroundColor = "transparent";
  if(isWorking){
    clearInterval(countdown)
    updateTimer(getInput(timeInput.value))
    preWorking();
    workModeBtn.style.backgroundColor = localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  }else if(!isWorking){
    clearInterval(restCountdown);
    clearInterval(longRestCountdown);
    updateTimer(getInput(timeInput.value))
    preWorking();
  }
});

shortBrakeModeBtn.addEventListener('click',function(){
  isRestingLong = false;
  longBrakeModeBtn.style.backgroundColor = "transparent";
  workModeBtn.style.backgroundColor = "transparent";
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
  shortBrakeModeBtn.style.backgroundColor = "transparent";
  workModeBtn.style.backgroundColor = "transparent";
  if(isWorking){
    clearInterval(countdown)
    updateTimer(getInput(timeLongRestInput.value))
    preRestingLong();
  }else if(!isWorking){
    clearInterval(restCountdown);
    clearInterval(longRestCountdown);
    updateTimer(getInput(timeLongRestInput.value))
    preRestingLong();
  }
});

tickingVolumeSlider.oninput = function(){
  tickingValue.innerText = this.value;
  localStorage.setItem("tickingValue", this.value);
}

alarmVolumeSlider.oninput = function(){
  alarmValue.innerText = this.value;
  localStorage.setItem("alarmValue", this.value);
}

generalTaskSettings.addEventListener("click", function () {
  if(generalTaskSettingsScreen.style.display === "none"){
  generalTaskSettingsScreen.style.display = "flex";
  }else{
    generalTaskSettingsScreen.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (!generalTaskSettings.contains(event.target) && !generalTaskSettingsScreen.contains(event.target) && generalTaskSettingsScreen.style.display === "flex") {
    generalTaskSettingsScreen.style.display = "none";
  }
});

clearFinishedTasks.addEventListener("click", function () {
  taskList = taskList.filter(task => !task.isChecked);
  saveTasks();
  updatePomodoroSummary();
})

clearAllTasks.addEventListener("click", function () {
  taskList = [];
  saveTasks();
  taskContainer.innerHTML = ""; 
  generalTaskSettingsScreen.style.display = "none";
  updatePomodoroSummary();
});





window.addEventListener("DOMContentLoaded", () => {
  pomodorosCounter.innerText = pomodosCounter;
  let acumulatedPomodoros = Number(localStorage.getItem("acumulatedPomodoros")) || 0;

  acumulatedPomodorosDone = parseInt(localStorage.getItem("acumulatedPomodorosDone")) || 0;
  acumulatedPomodorosDoneView.innerText = acumulatedPomodorosDone;
  acumulatedPomodorosView.innerText = acumulatedPomodoros;
  timeOfFinishingWork.innerText = localStorage.getItem("timeOfFinishingWork") || "00:00";

  //Load saved values from local storage 

if (isWorking && localStorage.getItem("workingColor")) {
  body.style.backgroundColor = localStorage.getItem("workingColor");
} else if (!isWorking && isRestingLong && localStorage.getItem("longBrakeColor")) {
  body.style.backgroundColor = localStorage.getItem("longBrakeColor");
} else if (!isWorking && !isRestingLong && localStorage.getItem("shortBrakeColor")) {
  body.style.backgroundColor = localStorage.getItem("shortBrakeColor");
}


  //  Inputs
  timeInput.value = localStorage.getItem("timeInput") || 25;
  timeRestInput.value = localStorage.getItem("timeRestInput") || 10;
  timeLongRestInput.value = localStorage.getItem("timeLongRestInput") || 25;
  longBrakeIntervalInput.value = localStorage.getItem("longBrakeIntervalInput") || 4;
  currentProject.innerText = localStorage.getItem("currentProject") || "Lets work!";
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
  alarmValue.innerText = localStorage.getItem("alarmValue") || 50;
  tickingVolumeSlider.value = localStorage.getItem("tickingVolumeSlider");
  tickingValue.innerText = localStorage.getItem("tickingValue") || 50;

  //On-start
  let initialTime = getInput(timeInput.value);
  let durationCountdown = parseInt(localStorage.getItem("countdown")) || 0;
  let restDurationCountdown = parseInt(localStorage.getItem("restCountdown")) || 0;
  let longRestDurationCountdown = parseInt(localStorage.getItem("longRestCountdown")) || 0;
  isWorking = localStorage.getItem("isWorking") === "true";
  isRestingLong = updateRestInterval();
  if (isWorking && durationCountdown < initialTime) {
    updateTimer(durationCountdown);
    startWorkTimer(durationCountdown, getInput(timeRestInput.value), getInput(timeLongRestInput.value));
    working();
  }else if(!isWorking && isRestingLong && longRestDurationCountdown < getInput(timeLongRestInput.value)){
    updateTimer(longRestDurationCountdown);
    startLongRestTimer(getInput(timeInput.value), getInput(timeRestInput.value), longRestDurationCountdown);
    restingLong();
  }else if(!isWorking && !isRestingLong && restDurationCountdown < getInput(timeRestInput.value)){
    updateTimer(restDurationCountdown);
    startRestTimer(getInput(timeInput.value), restDurationCountdown, getInput(timeLongRestInput.value));
    restingShort();
  }else if(isWorking && durationCountdown){
    updateTimer(initialTime);
    preWorking();
  }else if(!isWorking && isRestingLong && longRestDurationCountdown){
    updateTimer(longRestDurationCountdown);
    preRestingLong();
  }
  else if(!isWorking && !isRestingLong && restDurationCountdown){
    updateTimer(restDurationCountdown);
    preRestingShort();
  }
  taskList.forEach(renderTask);
});
