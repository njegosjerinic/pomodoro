// --- DOM Elements ---

const DOM = {
  body: document.body,
  timerBackground: document.querySelector(".timer-background"),
  countdownDisplay: document.getElementById("countdownDisplay"),
  smallCountdownDisplay: document.getElementById("countdownDisplay"),
  title: document.getElementById("title"),
  taskContainer: document.getElementById("container-for-tasks"),
  amountOfPomodorosInput: document.getElementById("amountOfPomodorosInput"),
  tasks: document.querySelectorAll(".task"),
  pomodorosCounter: document.getElementById("pomodorosCounter"),
  estimatedPomodorosContainer: document.querySelector(
    ".estimatedPomodorosContainer",
  ),
  acumulatedPomodorosView: document.querySelector(".acumulatedPomodoros"),
  acumulatedPomodorosDoneView: document.querySelector(
    ".acumulatedPomodorosDone",
  ),
  timeOfFinishingWork: document.querySelector(".timeOfFinishingWork"),
  currentProject: document.getElementById("currentProject"),
  progressToCompletion: document.querySelector(".progress"),

  //Inputs
  input: {
    taskInput: document.getElementById("taskInput"),
    timeInput: document.getElementById("timeInput"),
    timeRestInput: document.getElementById("timeRestInput"),
    timeLongRestInput: document.getElementById("longBreakTimeInput"),
    longBrakeIntervalInput: document.getElementById("longBreakIntervalInput"),
    repeatAlarmInput: document.getElementById("repeatAlarmInput"),
  },
  buttons: {
    timeBtnStart: document.getElementById("timeBtnStart"),
    timeBtnPause: document.getElementById("timeBtnPause"),
    timeBtnFF: document.getElementById("timeBtnFF"),
    addTaskBtn: document.getElementById("addTaskBtn"),
    exitSettingsButton: document.getElementById("exit-settings"),
    createTask: document.getElementById("createTask"),
    cancelCreation: document.getElementById("cancelCreation"),
    inputBtn: document.getElementById("inputTimeBtn"),
    workModeBtn: document.getElementById("workModeBtn"),
    shortBrakeModeBtn: document.getElementById("shortBrakeBtn"),
    longBrakeModeBtn: document.getElementById("longBrakeBtn"),
    workingColor: document.getElementById("workingColor"),
    shortBrakeColor: document.getElementById("shortbreakColor"),
    longBrakeColor: document.getElementById("longbreakColor"),
    generalTaskSettings: document.getElementById("generalTaskSettings"),
    clearFinishedTasks: document.getElementById("clearFinishedTasks"),
    clearAllTasks: document.getElementById("clearAllTasks"),
    smallWindowOpenBtn: document.getElementById("smallWindowOpenBtn"),
  },
  //  Checkboxes
  checkboxes: {
    autoStartBreaksCheck: document.getElementById("autoStartBreaksSlider"),
    autoStartPomodorosCheck: document.getElementById(
      "autoStartPomodorosSlider",
    ),
    autoCheckTasksCheck: document.getElementById("autoCheckTasks"),
    autoSwitchTasksCheck: document.getElementById("autoSwitchTasks"),
    darkModeCheck: document.getElementById("darkMode"),
  },
  // Dropdowns
  dropdowns: {
    alarmSoundsDropDown: document.getElementById("alarmSounds"),
    tickingSoundsDropDown: document.getElementById("tickingSounds"),
    hourFormatSelection: document.getElementById("hourFormatSelection"),
  },
  //  Sliders
  sliders: {
    alarmVolumeSlider: document.getElementById("alarmVolumeSlider"),
    alarmValue: document.getElementById("alarmValue"),
    tickingVolumeSlider: document.getElementById("tickingVolumeSlider"),
    tickingValue: document.getElementById("tickingValue"),
  },
  // Panels and Screens
  panelsAndScreens: {
    settingsScreen: document.querySelector(".settings-screen"),
    addTaskPanel: document.getElementById("addTaskPanel"),
    overlay: document.getElementById("overlay"),
    colorSelector: document.querySelector(".color-selector"),
    colorSelectorContainer: document.querySelector(".color-selector-container"),
    generalTaskSettingsScreen: document.querySelector(
      ".generalTaskSettingsScreen",
    ),
  },
};

window.timeInput = DOM.input.timeInput;
window.timeRestInput = DOM.input.timeRestInput;
window.timeLongRestInput = DOM.input.timeLongRestInput;

DOM.panelsAndScreens.generalTaskSettingsScreen.style.display = "none";

// Audios for alarm
const kitchenAudio = new Audio("audiomass-output.mp3");
const bellAudio = new Audio("bellAudio.mp3");

// Audios for ticking
const slowTickingSound = new Audio("usedSlowClock.mp3");
const fastTickingSound = new Audio("usedFastClock.mp3");

// Clicking start
const startingCLick = new Audio("clickingStart.wav");

// --- App State ---
const state = {
  workTime: parseInt(localStorage.getItem("timeInput")) || 25,
  restTime: parseInt(localStorage.getItem("timeRestInput")) || 10,
  longRestTime: parseInt(localStorage.getItem("timeLongRestInput")) || 25,
  isRestingLong: false,
  timeRemaining: 1500,
  isPaused: false,
  timerId: null,
  status: "working",
  numberOfTasks: 0,
  pomodosCounter: parseInt(sessionStorage.getItem("allPomodorosCounter")) || 0,
  taskList: JSON.parse(localStorage.getItem("tasks")) || [],
  colorSelectorMode: null,
  acumulatedPomodoros: 0,
  acumulatedPomodorosDone: 0,
  overrideState: null,
};

console.log(state);

//==============UTILITIES==================//
//This takes input that has been translated to seconds and translates it back to minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  DOM.smallCountdownDisplay.innerText = `${minutes < 10 ? "0" : ""}${minutes}`;

  if (miniWindow) {
    miniWindow.postMessage({ type: "SMALL_TIMER", duration: minutes });
  }
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
  DOM.body.style.backgroundColor =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.buttons.timeBtnStart.style.display = "block";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.buttons.timeBtnFF.style.display = "none";
  DOM.buttons.timeBtnPause.style.display = "none";
  DOM.taskContainer.style.display = "flex";
  DOM.buttons.workModeBtn.style.backgroundColor =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
}

function working() {
  DOM.body.style.backgroundColor =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.buttons.timeBtnStart.style.display = "none";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.buttons.timeBtnFF.style.display = "block";
  DOM.buttons.timeBtnPause.style.display = "block";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.buttons.workModeBtn.style.backgroundColor =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.estimatedPomodorosContainer.style.display = "flex";
}

function showWorkDarkModeUI() {
  DOM.body.style.backgroundColor = "black";
  DOM.buttons.timeBtnStart.style.display = "none";
  DOM.buttons.timeBtnFF.style.display = "block";
  DOM.buttons.timeBtnPause.style.display = "block";
  DOM.taskContainer.style.display = "none";
  DOM.title.style.display = "none";
  DOM.estimatedPomodorosContainer.style.display = "none";
  DOM.buttons.addTaskBtn.style.display = "none";
  DOM.buttons.workModeBtn.style.display = "none";
  DOM.buttons.shortBrakeModeBtn.style.display = "none";
  DOM.buttons.longBrakeModeBtn.style.display = "none";
  DOM.timerBackground.style.background = "transparent";
  DOM.buttons.timeBtnPause.style.background = "transparent";
  DOM.buttons.timeBtnPause.style.color = "white";
}

function preRestingShort() {
  DOM.buttons.timeBtnStart.style.display = "block";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.timeBtnFF.style.display = "none";
  DOM.buttons.timeBtnPause.style.display = "none";
  DOM.body.style.backgroundColor =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.taskContainer.style.display = "flex";
  DOM.buttons.shortBrakeModeBtn.style.backgroundColor =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
}

function restingShort() {
  DOM.body.style.backgroundColor =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.timeBtnStart.style.display = "none";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.timeBtnFF.style.display = "block";
  DOM.buttons.timeBtnPause.style.display = "block";
  DOM.taskContainer.style.display = "flex";
  DOM.buttons.shortBrakeColor.style.backgroundColor =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.backgroundColor =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("shortBrakeColor") || "rgb(56, 133, 138)";
}

function preRestingLong() {
  DOM.buttons.timeBtnStart.style.display = "block";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.timeBtnFF.style.display = "none";
  DOM.buttons.timeBtnPause.style.display = "none";
  DOM.body.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.taskContainer.style.display = "flex";
  DOM.buttons.longBrakeModeBtn.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
}

function restingLong() {
  DOM.body.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.timeBtnStart.style.display = "none";
  DOM.buttons.timeBtnStart.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.timeBtnFF.style.display = "block";
  DOM.buttons.timeBtnPause.style.display = "block";
  DOM.taskContainer.style.display = "flex";
  DOM.buttons.longBrakeColor.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.backgroundColor =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
}

//States that have to do with pausing
function pauseCountdownWork() {
  DOM.buttons.timeBtnPause.innerText = "START";
  localStorage.getItem("workingColor")
    ? (DOM.body.style.backgroundColor = localStorage.getItem("workingColor"))
    : (DOM.body.style.backgroundColor = "rgb(186, 73, 73)");
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.borderRadius = "5px";
  DOM.buttons.timeBtnPause.style.color
    ? (DOM.body.style.backgroundColor = localStorage.getItem("workingColor"))
    : (DOM.body.style.backgroundColor = "rgb(186, 73, 73)");
  DOM.buttons.timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  DOM.buttons.timeBtnFF.style.display = "none";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
}

function resumeCountdownWork() {
  DOM.buttons.timeBtnPause.innerText = "PAUSE";
  localStorage.getItem("workingColor")
    ? (DOM.body.style.backgroundColor = localStorage.getItem("workingColor"))
    : (DOM.body.style.backgroundColor = "rgb(186, 73, 73)");
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  if (DOM.checkboxes.darkModeCheck.checked) {
    DOM.buttons.timeBtnPause.style.background = "transparent";
    DOM.buttons.timeBtnPause.style.color = "white";
  } else {
    DOM.buttons.timeBtnPause.style.background = "white";
    DOM.buttons.timeBtnPause.style.color
      ? (DOM.body.style.backgroundColor = localStorage.getItem("workingColor"))
      : (DOM.body.style.backgroundColor = "rgb(186, 73, 73)");
  }
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  DOM.buttons.timeBtnPause.style.boxShadow = " 0px 0px 0px";
}

function pauseCountdownRestingShort() {
  DOM.buttons.timeBtnPause.innerText = "START";
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.borderRadius = "5px";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  DOM.buttons.timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  DOM.buttons.timeBtnFF.style.display = "none";
}

function resumeCountdownRestingShort() {
  DOM.buttons.timeBtnPause.innerText = "PAUSE";
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("shortBrakeColor") || "rgba(55, 141, 55, 1)";
  DOM.buttons.timeBtnPause.style.boxShadow = " 0px 0px 0px";
  DOM.buttons.timeBtnFF.style.display = "block";
}

function pauseCountdownRestingLong() {
  DOM.buttons.timeBtnPause.innerText = "START";
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.borderRadius = "5px";

  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.timeBtnPause.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  DOM.buttons.timeBtnFF.style.display = "none";
}

function resumeCountdownRestingLong() {
  DOM.buttons.timeBtnPause.innerText = "PAUSE";
  DOM.taskContainer.style.display = "flex";
  DOM.title.style.display = "flex";
  DOM.estimatedPomodorosContainer.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "block";
  DOM.buttons.workModeBtn.style.display = "block";
  DOM.buttons.shortBrakeModeBtn.style.display = "block";
  DOM.buttons.longBrakeModeBtn.style.display = "block";
  DOM.timerBackground.style.background = "rgba(255, 255, 255, 0.1)";
  DOM.buttons.timeBtnPause.style.background = "white";
  DOM.buttons.timeBtnPause.style.color =
    localStorage.getItem("longBrakeColor") || "rgb(57, 112, 151)";
  DOM.buttons.timeBtnPause.style.boxShadow = " 0px 0px 0px";
  DOM.buttons.timeBtnFF.style.display = "block";
}

function updateRestInterval() {
  if (state.overrideState !== null) {
    return false;
  }

  if (state.pomodosCounter % DOM.input.longBrakeIntervalInput.value != 0) {
    return false;
  } else {
    return true;
  }
}

function switchState() {
  if (state.status === "working") {
    state.status = "resting";
    state.timeRemaining = getInput(state.restTime);
  } else {
    state.status = "working";
    state.timeRemaining = getInput(state.workTime);
  }
}

function tick() {
  state.timeRemaining--;
  updateTimer(state.timeRemaining);

  if (state.timeRemaining <= 0) {
    switchState();
  }
}

//Spliting the timer function into workTimer(), restTimer() and longRestTimer()

function startTimer(duration) {
  DOM.buttons.timeBtnPause.innerText = "PAUSE";
  clearInterval(state.timerId);
  updateTimer(duration);
  state.timeRemaining = duration;
  state.timerId = setInterval(tick, 1000);
}

function updateTimer(time) {
  DOM.countdownDisplay.innerText = formatTime(time);
  if (miniWindow && !miniWindow.closed) {
    miniWindow.postMessage({ type: "TIMER", duration: formatTime(time) });
  }
}

function updatePomodorosCounter() {
  state.pomodosCounter++;
  state.acumulatedPomodorosDone++;
  DOM.acumulatedPomodorosDoneView.innerText = state.acumulatedPomodorosDone;
  localStorage.setItem(
    "acumulatedPomodorosDone",
    state.acumulatedPomodorosDone,
  );
  localStorage.setItem(
    "acumulatedPomodorosDone",
    state.acumulatedPomodorosDone,
  );
  sessionStorage.setItem("allPomodorosCounter", state.pomodosCounter);
  DOM.pomodorosCounter.innerText = state.pomodosCounter;
  state.taskList.forEach((task) => {
    if (task.isActive) {
      task.donePomodoros++;
      saveTasks();
    }
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(state.taskList));
}

function createElement(tag, className = "", style = {}) {
  const el = document.createElement(tag);
  el.className = className;
  Object.assign(el.style, style);
  return el;
}

//This renders the Tasks
function renderTask(task) {
  let { id, name, pomodorosToDo, donePomodoros, isActive, isChecked } = task;

  const taskDiv = createElement("div", "task");
  taskDiv.dataset.id = id;

  let taskContent = createElement("div", "task-content", {
    display: "flex",
    gap: "10px",
  });
  taskContent.className = "task-content";

  let taskDonenesAndName = createElement("div", "task-donenes-and-name", {
    display: "flex",
    alignItems: "center",
    height: "50px",
    gap: "10px",
    padding: "0px 20px",
  });

  let taskDonenes = createElement("label", "custom-checkbox");

  const checkbox = createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${Date.now()}`;

  const checkmark = createElement("span", "checkmark");

  const taskDesc = createElement("p", "task-description");
  taskDesc.innerText = name;

  const taskTime = document.createElement("p");
  taskTime.innerText = `${donePomodoros} / ${pomodorosToDo}`;

  if (isActive) {
    taskDiv.className = "task active";
  }

  if (isChecked && DOM.checkboxes.autoSwitchTasksCheck.checked) {
    taskDesc.style.textDecoration = "line-through";
    checkmark.style.backgroundColor = "indianred";
  } else if (isChecked) {
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

  const actEstPomodoros = createElement("div");
  actEstPomodoros.innerText = "Act / Est Pomodoros";
  actEstPomodoros.style.color = "black";
  actEstPomodoros.style.fontWeight = "600";

  const settingsPomodorosInput = createElement("input");
  settingsPomodorosInput.value = task.pomodorosToDo;
  settingsPomodorosInput.type = "number";
  settingsPomodorosInput.style.border = "none";
  settingsPomodorosInput.style.background = "#efefef";
  settingsPomodorosInput.style.width = "50px";
  settingsPomodorosInput.style.height = "35px";
  settingsPomodorosInput.style.borderRadius = "5px";

  const pomodoroCounterForTaskModificationDiv = createElement("p");
  pomodoroCounterForTaskModificationDiv.innerText = donePomodoros;

  const modifyingPomodorosToDoContainer = createElement("div");
  modifyingPomodorosToDoContainer.className = "modifying-pomodoros-container";

  modifyingPomodorosToDoContainer.append(
    pomodoroCounterForTaskModificationDiv,
    "/",
    settingsPomodorosInput,
  );

  taskModInputPanel.append(
    settingsTaskInput,
    actEstPomodoros,
    modifyingPomodorosToDoContainer,
  );
  taskModInputPanel.style.height = "60%";
  taskModInputPanel.style.display = "flex";
  taskModInputPanel.style.flexDirection = "column";
  taskModInputPanel.style.alignItems = "flex-start";
  taskModInputPanel.style.gap = "30px";
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

  saveTaskEditBtn.addEventListener("click", function (e) {
    // For counter
    state.acumulatedPomodoros =
      parseInt(state.acumulatedPomodoros) - task.pomodorosToDo;
    state.acumulatedPomodoros =
      parseInt(state.acumulatedPomodoros) +
      parseInt(settingsPomodorosInput.value);
    DOM.acumulatedPomodorosView.innerText = state.acumulatedPomodoros;
    localStorage.setItem("acumulatedPomodoros", state.acumulatedPomodoros);

    // For task
    e.stopPropagation();
    taskDesc.innerText = settingsTaskInput.value;
    task.name = settingsTaskInput.value;
    task.pomodorosToDo = parseInt(settingsPomodorosInput.value, 10);
    pomodoroCounterForTaskModificationDiv.innerText = task.donePomodoros;
    settingsPomodorosInput.value = task.pomodorosToDo;
    taskTime.innerText = `${task.donePomodoros} / ${task.pomodorosToDo}`;
    taskDiv.style.height = "70px";
    taskDiv.style.flexDirection = "row";
    taskDonenes.style.display = "flex";
    settingsTaskInput.style.display = "none";
    taskDesc.style.display = "flex";
    taskContent.style.display = "flex";
    taskModPanel.style.display = "none";
    taskDonenesAndName.style.display = "flex";
    localStorage.setItem("tasks", JSON.stringify(state.taskList));
  });

  saveAndCancelDiv.append(cancelTaskEditBtn, saveTaskEditBtn);

  buttonsForManipulationDiv.append(deleteTaskBtn, saveAndCancelDiv);
  buttonsForManipulationDiv.style.display = "flex";
  buttonsForManipulationDiv.style.justifyContent = "space-between";
  buttonsForManipulationDiv.className = "buttons-for-manipulation";

  taskModPanel.append(taskModInputPanel, buttonsForManipulationDiv);
  taskModPanel.style.display = "none";
  taskModPanel.style.width = "102%";
  taskModPanel.style.height = "100%";
  taskModPanel.style.flexDirection = "column";
  taskModPanel.style.justifyContent = "space-between";
  taskModPanel.style.margin = "0px";

  taskSettingsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    taskDiv.style.height = "282px";
    taskDonenes.style.display = "none";
    settingsTaskInput.style.display = "block";
    taskDesc.style.display = "none";
    taskContent.style.display = "none";
    taskDiv.style.display = "flex";
    taskDiv.style.flexDirection = "column";
    taskDonenesAndName.style.display = "none";
    taskModPanel.style.display = "flex";
    taskDiv.style.padding = "0 5px";
    settingsTaskInput.focus();
    settingsTaskInput.setSelectionRange(
      settingsTaskInput.value.length,
      settingsTaskInput.value.length,
    );
    settingsTaskInput.style.outline = "none";
    taskDiv.style.border = "0";
  });

  cancelTaskEditBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    taskDiv.style.height = "70px";
    taskDiv.style.flexDirection = "row";
    taskDonenes.style.display = "flex";
    settingsTaskInput.style.display = "none";
    taskDesc.style.display = "flex";
    taskContent.style.display = "flex";
    taskDonenesAndName.style.display = "flex";
    taskModPanel.style.display = "flex";
    taskModPanel.style.display = "none";
    if (task.isActive) {
      taskDiv.style.borderLeft = "5px solid black";
    }
  });

  deleteTaskBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    DOM.taskContainer.removeChild(taskDiv);
    state.taskList = state.taskList.filter((t) => t.id !== id);
    saveTasks();
    state.acumulatedPomodoros -= pomodorosToDo;
    localStorage.setItem("acumulatedPomodoros", state.acumulatedPomodoros);
  });

  taskDiv.addEventListener("click", () => {
    if (taskDiv.classList.contains("active")) return;

    document
      .querySelectorAll(".task.active")
      .forEach((el) => el.classList.remove("active"));

    taskDiv.classList.add("active");

    state.taskList.forEach((t) => (t.isActive = false));
    task.isActive = true;
    DOM.currentProject.innerText = task.name;
    localStorage.setItem("currentProject", DOM.currentProject.innerText);
    taskTime.innerText = `${task.donePomodoros} / ${pomodorosToDo}`;
    saveTasks();
  });

  checkbox.addEventListener("click", function (e) {
    e.stopPropagation();
    if (taskDesc.style.textDecoration === "line-through") {
      taskDesc.style.textDecoration = "none";
      task.isChecked = false;
    } else {
      taskDesc.style.textDecoration = "line-through";
      task.isChecked = true;
    }
    saveTasks();
  });

  taskDonenes.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  taskContent.append(taskTime, taskSettingsButton);

  taskDonenes.append(checkbox, checkmark);

  taskDonenesAndName.append(taskDonenes, taskDesc);

  taskDiv.append(taskDonenesAndName, taskContent, taskModPanel);

  DOM.taskContainer.appendChild(taskDiv);
}

function addTask() {
  const name = DOM.input.taskInput.value.trim();
  const pomodorosToDo = parseInt(DOM.amountOfPomodorosInput.value, 10);

  state.acumulatedPomodoros += pomodorosToDo;

  DOM.acumulatedPomodorosView.innerText = state.acumulatedPomodoros;

  localStorage.setItem("acumulatedPomodoros", state.acumulatedPomodoros);

  const finishTimestamp =
    Date.now() +
    state.acumulatedPomodoros * getInput(DOM.input.timeInput.value) * 1000;
  const finishTime = new Date(finishTimestamp);

  DOM.timeOfFinishingWork.innerText = finishTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: is24HourFormat(),
  });
  localStorage.setItem(
    "timeOfFinishingWork",
    DOM.timeOfFinishingWork.innerText,
  );

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
    isChecked: false,
  };

  state.taskList.push(newTask);
  saveTasks();
  renderTask(newTask);

  DOM.input.taskInput.value = "";
  DOM.amountOfPomodorosInput.value = "1";
}

function updatePomodorosCounterPerTask() {
  DOM.taskContainer.innerHTML = "";

  // 2) re‑render each task
  state.taskList.forEach(renderTask);
}

function taskCompletionCheck() {
  for (let index = 0; index < state.taskList.length; index++) {
    const task = state.taskList[index];
    const nextTask = state.taskList.every((task) => task.isChecked)
      ? null
      : state.taskList[0];

    if (
      DOM.checkboxes.autoCheckTasksCheck.checked &&
      task.donePomodoros >= task.pomodorosToDo - 1 &&
      task.isActive
    ) {
      task.isChecked = true;

      if (DOM.checkboxes.autoSwitchTasksCheck.checked) {
        task.isActive = false;
        if (nextTask) {
          nextTask.isActive = true;
        }

        if (state.taskList.length >= 2) {
          state.taskList.splice(index, 1); // Remove from current position
          state.taskList.push(task); // Move to the end
        }
      }
    }
  }
  saveTasks();
}

function alarmSoundSelector() {
  if (DOM.dropdowns.alarmSoundsDropDown.value === "kitchen") {
    for (let i = 0; i < DOM.input.repeatAlarmInput.value; i++) {
      kitchenAudio.play();
    }
    kitchenAudio.volume = DOM.sliders.alarmVolumeSlider.value / 100;
  } else {
    for (let i = 0; i < DOM.input.repeatAlarmInput.value; i++) {
      bellAudio.play();
    }
    bellAudio.volume = DOM.sliders.alarmVolumeSlider.value / 100;
  }
}

function tickingSoundMod() {
  if (DOM.checkboxes.tickingSoundsDropDown.value === "ticking-fast") {
    fastTickingSound.play();
    fastTickingSound.volume = DOM.sliders.tickingVolumeSlider.value / 100;
  } else if (DOM.checkboxes.tickingSoundsDropDown.value === "ticking-slow") {
    slowTickingSound.play();
    slowTickingSound.volume = DOM.sliders.tickingVolumeSlider.value / 100;
  } else if (DOM.checkboxes.tickingSoundsDropDown.value === "none") {
    fastTickingSound.pause();
    slowTickingSound.pause();
  }
}

function toggleColorSelector() {
  if (
    DOM.panelsAndScreens.colorSelector.style.display === "none" ||
    DOM.panelsAndScreens.colorSelector.style.display === ""
  ) {
    DOM.panelsAndScreens.colorSelector.style.display = "block";
    DOM.panelsAndScreens.colorSelectorContainer.style.display = "flex";
    DOM.panelsAndScreens.colorSelectorContainer.style.flexDirection = "column";
  } else {
    DOM.panelsAndScreens.colorSelector.style.display = "none";
    DOM.panelsAndScreens.colorSelectorContainer.style.display = "none";
  }
}

function colorSelectorDivs(button) {
  const color = button.dataset.color;
  if (state.colorSelectorMode === "working") {
    localStorage.setItem("workingColor", color);
    DOM.buttons.workingColor.style.backgroundColor = color;
    if (state.isWorking) {
      DOM.body.style.backgroundColor = color;
      DOM.buttons.workModeBtn.style.backgroundColor = color;
      DOM.buttons.shortBrakeModeBtn.style.backgroundColor = "transparent";
      DOM.buttons.longBrakeModeBtn.style.backgroundColor = "transparent";
    }
  } else if (state.colorSelectorMode === "shortBrake") {
    localStorage.setItem("shortBrakeColor", color);
    DOM.buttons.shortBrakeColor.style.backgroundColor = color;
    if (!state.isWorking && !state.isRestingLong) {
      DOM.body.style.backgroundColor = color;
      DOM.buttons.shortBrakeModeBtn.style.backgroundColor = color;
      DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
      DOM.buttons.longBrakeModeBtn.style.backgroundColor = "transparent";
    }
  } else if (state.colorSelectorMode === "longBrake") {
    localStorage.setItem("longBrakeColor", color);
    DOM.buttons.longBrakeColor.style.backgroundColor = color;
    if (!state.isWorking && state.isRestingLong) {
      DOM.body.style.backgroundColor = color;
      DOM.buttons.longBrakeModeBtn.style.backgroundColor = color;
      DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
      DOM.buttons.shortBrakeModeBtn.style.backgroundColor = "transparent";
    }
  }
}

function is24HourFormat() {
  return DOM.dropdowns.hourFormatSelection.value !== "24-hour";
}

function updatePomodoroSummary() {
  DOM.acumulatedPomodorosView.innerText = state.acumulatedPomodoros;

  const finishTimestamp =
    Date.now() +
    state.acumulatedPomodoros * getInput(DOM.input.timeInput.value) * 1000;
  const finishTime = new Date(finishTimestamp);

  DOM.timeOfFinishingWork.innerText = finishTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: is24HourFormat(),
  });

  localStorage.setItem(
    "timeOfFinishingWork",
    DOM.timeOfFinishingWork.innerText,
  );
  localStorage.setItem("acumulatedPomodoros", state.acumulatedPomodoros);
}

function progressBarUpdate(remeaningTime, totalTime) {
  const percent = 100 - (remeaningTime / totalTime) * 100;
  DOM.progressToCompletion.style.width = `${percent}%`;
}

function clickStartButton() {
  DOM.buttons.timeBtnStart.style.boxShadow = "0px 0px 0px";
}

//================================================================EVENT LISTENERS============================================================//
let miniWindow = null;

function openMini() {
  miniWindow = window.open("mini.html", "Mini", "width=200,height=1000");
}

DOM.buttons.smallWindowOpenBtn.addEventListener("click", openMini);

settings.addEventListener("click", function () {
  DOM.panelsAndScreens.settingsScreen.style.display = "block";
  DOM.panelsAndScreens.overlay.style.display = "flex";
});

DOM.buttons.exitSettingsButton.addEventListener("click", function () {
  DOM.panelsAndScreens.settingsScreen.style.display = "none";
  DOM.panelsAndScreens.overlay.style.display = "none";
});

DOM.panelsAndScreens.colorSelectorContainer.addEventListener(
  "click",
  function (event) {
    event.stopPropagation();
    if (DOM.panelsAndScreens.colorSelectorContainer.contains(event.target)) {
      DOM.panelsAndScreens.colorSelector.style.display = "none";
      DOM.panelsAndScreens.colorSelectorContainer.style.display = "none";
      DOM.panelsAndScreens.settingsScreen.style.display = "block";
      DOM.panelsAndScreens.overlay.style.alignItems = "flex-start";
      state.colorSelectorMode = null;
    }
  },
);

DOM.panelsAndScreens.overlay.addEventListener("click", function (event) {
  event.stopPropagation();
  if (!settingsScreen.contains(event.target)) {
    DOM.panelsAndScreens.settingsScreen.style.display = "none";
    DOM.panelsAndScreens.overlay.style.display = "none";
    DOM.panelsAndScreens.colorSelector.style.display = "none";
    DOM.panelsAndScreens.colorSelectorContainer.style.display = "none";
  }
});

// Color selector
DOM.buttons.workingColor.addEventListener("click", function () {
  document.getElementById("colorTitleUse").innerText = "Pomodoro";
  toggleColorSelector();
  DOM.panelsAndScreens.settingsScreen.style.display = "none";
  DOM.panelsAndScreens.overlay.style.alignItems = "center";
  state.colorSelectorMode = "working";
});

DOM.buttons.shortBrakeColor.addEventListener("click", function () {
  document.getElementById("colorTitleUse").innerText = "Short Break";
  toggleColorSelector();
  DOM.panelsAndScreens.settingsScreen.style.display = "none";
  DOM.panelsAndScreens.overlay.style.alignItems = "center";
  state.colorSelectorMode = "shortBrake";
});

DOM.buttons.longBrakeColor.addEventListener("click", function () {
  document.getElementById("colorTitleUse").innerText = "Long Break";
  toggleColorSelector();
  DOM.panelsAndScreens.settingsScreen.style.display = "none";
  DOM.panelsAndScreens.overlay.style.alignItems = "center";
  state.colorSelectorMode = "longBrake";
});

//  Save input values when Ok is clicked in the settings menu
DOM.buttons.inputBtn.addEventListener("click", function () {
  DOM.panelsAndScreens.settingsScreen.style.display = "none";
  DOM.panelsAndScreens.overlay.style.display = "none";

  //  Inputs
  localStorage.setItem("timeInput", DOM.input.timeInput.value);
  localStorage.setItem("timeRestInput", DOM.input.timeRestInput.value);
  localStorage.setItem("timeLongRestInput", DOM.input.timeLongRestInput.value);
  localStorage.setItem(
    "longBrakeIntervalInput",
    DOM.input.longBrakeIntervalInput.value,
  );
  localStorage.setItem("repeatAlarmInput", DOM.input.repeatAlarmInput.value);

  //  Checkboxes
  localStorage.setItem(
    "autoStartBreaksSlider",
    DOM.checkboxes.autoStartBreaksCheck.checked,
  );
  localStorage.setItem(
    "autoStartPomodorosSlider",
    DOM.checkboxes.autoStartPomodorosCheck.checked,
  );
  localStorage.setItem(
    "autoCheckTasks",
    DOM.checkboxes.autoCheckTasksCheck.checked,
  );
  localStorage.setItem(
    "autoSwitchTasks",
    DOM.checkboxes.autoSwitchTasksCheck.checked,
  );
  localStorage.setItem("darkMode", DOM.checkboxes.darkModeCheck.checked);

  // Dropdowns
  localStorage.setItem("alarmSounds", DOM.dropdowns.alarmSoundsDropDown.value);
  localStorage.setItem(
    "tickingSounds",
    DOM.checkboxes.tickingSoundsDropDown.value,
  );
  localStorage.setItem(
    "hourFormatSelection",
    DOM.dropdowns.hourFormatSelection.value,
  );

  //  Sliders
  localStorage.setItem(
    "alarmVolumeSlider",
    DOM.sliders.alarmVolumeSlider.value,
  );
  localStorage.setItem("alarmValue", DOM.sliders.alarmVolumeSlider.value);
  localStorage.setItem(
    "tickingVolumeSlider",
    DOM.sliders.tickingVolumeSlider.value,
  );
  localStorage.setItem("tickingValue", DOM.sliders.tickingVolumeSlider.value);

  if (state.isWorking) {
    updateTimer(getInput(localStorage.getItem("timeInput")));
  }
});

//  Starting the timer
DOM.buttons.timeBtnStart.addEventListener("click", function () {
  DOM.buttons.timeBtnStart.disabled = true;
  console.log(state);
  if (miniWindow) {
    miniWindow.DOM.buttons.timeBtnStart.style.display = "none";
  }
  if (state.status === "working") {
    updatePomodorosCounter();
    startTimer(getInput(state.workTime));
    DOM.checkboxes.darkModeCheck.checked ? showWorkDarkModeUI() : working();
    updatePomodorosCounterPerTask();
  } else if (updateRestInterval() || state.isRestingLong) {
    startTimer(getInput(state.longRestTime));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
  } else {
    startTimer(getInput(state.restTime));
    taskCompletionCheck();
    updatePomodorosCounterPerTask();
  }
  startingCLick.play();
});

//  Actions that the Fast Foward button does
DOM.buttons.timeBtnFF.addEventListener("click", function () {
  DOM.progressToCompletion.style.width = "0%";
  clearInterval(state.timerId);
  state.isRestingLong = updateRestInterval(); // Always update this dynamically

  state.overrideState = null;

  if ((state.status = "working")) {
    state.status = "resting";

    if (state.isRestingLong) {
      updateTimer(getInput(state.longRestTime));
      preRestingLong();
      DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
    } else {
      updateTimer(getInput(state.restTime));
      preRestingShort();
    }
  } else {
    updateTimer(getInput(state.workTime));
    localStorage.setItem("countdown", state.workTime);
    preWorking();
    state.status = "working";
    state.isRestingLong = false;
    localStorage.setItem("isRestingLong", state.isRestingLong);
    DOM.buttons.longBrakeModeBtn.style.backgroundColor = "transparent";
    if (miniWindow) {
      miniWindow.preWorking();
      miniWindow.timeBtnStartMini.style.display = "block";
    }
  }

  DOM.buttons.timeBtnStart.disabled = false;
  DOM.buttons.timeBtnStart.style.boxShadow = "rgb(235, 235, 235) 0px 6px 0px";
  saveTasks();
});

//  Code for pausing

DOM.buttons.timeBtnPause.addEventListener("click", function () {
  if (state.status === "working") {
    if (state.isPaused) {
      resumeCountdownWork();
      if (miniWindow) {
        miniWindow.resumeCountdownWork();
        miniWindow.console.log("works");
      }
      startingCLick.play();
    } else {
      pauseCountdownWork();
      if (miniWindow) {
        miniWindow.pauseCountdownWork();
      }
    }
  } else {
    if (updateRestInterval()) {
      if (state.isPaused) {
        resumeCountdownRestingLong();
        startingCLick.play();
        if (miniWindow) {
          miniWindow.resumeCountdownRestingLong();
        }
      } else {
        pauseCountdownRestingLong();
        if (miniWindow) {
          miniWindow.pauseCountdownRestingLong();
        }
      }
    } else {
      if (state.isPaused) {
        resumeCountdownRestingShort();
        startingCLick.play();
        if (miniWindow) {
          miniWindow.resumeCountdownRestingShort();
        }
      } else {
        pauseCountdownRestingShort();
        if (miniWindow) {
          miniWindow.pauseCountdownRestingShort();
        }
      }
    }
  }
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "TOGGLE_TIMER") {
    if (state.isWorking) {
      if (state.isPaused) {
        resumeCountdownWork();
      } else {
        pauseCountdownWork();
      }
    } else {
      if (updateRestInterval()) {
        if (state.isPaused) {
          resumeCountdownRestingLong();
        } else {
          pauseCountdownRestingLong();
        }
      } else {
        if (state.isPaused) {
          resumeCountdownRestingShort();
        } else {
          pauseCountdownRestingShort();
        }
      }
    }
  }
});

DOM.buttons.addTaskBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  DOM.panelsAndScreens.addTaskPanel.style.display = "flex";
  DOM.buttons.addTaskBtn.style.display = "none";
});

DOM.buttons.cancelCreation.addEventListener("click", function () {
  DOM.panelsAndScreens.addTaskPanel.style.display = "none";
  DOM.buttons.addTaskBtn.style.display = "block";
});

DOM.buttons.createTask.addEventListener("click", addTask);

document.addEventListener("click", function (event) {
  if (
    !DOM.panelsAndScreens.addTaskPanel.contains(event.target) &&
    DOM.panelsAndScreens.addTaskPanel.style.display === "flex"
  ) {
    DOM.panelsAndScreens.addTaskPanel.style.display = "none";
    DOM.buttons.addTaskBtn.style.display = "block";
  }
});

DOM.buttons.workModeBtn.addEventListener("click", function () {
  state.isRestingLong = false;
  state.isWorking = true;

  DOM.buttons.shortBrakeModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.longBrakeModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.timeBtnStart.disabled = false;

  clearInterval(state.countdown);
  clearInterval(state.restCountdown);
  clearInterval(state.longRestCountdown);

  if (state.isWorking) {
    updateTimer(getInput(DOM.input.timeInput.value));
    preWorking();
    DOM.buttons.workModeBtn.style.backgroundColor =
      localStorage.getItem("workingColor") || "rgb(186, 73, 73)";
  } else if (!state.isWorking) {
    updateTimer(getInput(DOM.input.timeInput.value));
    preWorking();
  }

  localStorage.setItem("countdown", getInput(DOM.input.timeInput.value));
  localStorage.setItem(
    "longRestCountdown",
    getInput(DOM.input.timeLongRestInput.value),
  );
  localStorage.setItem(
    "restCountdown",
    getInput(DOM.input.timeRestInput.value),
  );
  localStorage.setItem("isWorking", state.isWorking);
  localStorage.setItem("isRestingLong", state.isRestingLong);
  saveTasks();
});

DOM.buttons.shortBrakeModeBtn.addEventListener("click", function () {
  state.isRestingLong = false;
  state.isWorking = false;

  DOM.buttons.longBrakeModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.timeBtnStart.disabled = false;

  clearInterval(state.restCountdown);
  clearInterval(state.longRestCountdown);
  clearInterval(state.countdown);

  updateTimer(getInput(DOM.input.timeRestInput.value));
  preRestingShort();

  state.overrideState = true;
  console.log(state.overrideState);

  localStorage.setItem("countdown", getInput(DOM.input.timeInput.value));
  localStorage.setItem(
    "longRestCountdown",
    getInput(DOM.input.timeLongRestInput.value),
  );
  localStorage.setItem(
    "restCountdown",
    getInput(DOM.input.timeRestInput.value),
  );
  localStorage.setItem("isWorking", state.isWorking);
  localStorage.setItem("isRestingLong", state.isRestingLong);
  saveTasks();
});

DOM.buttons.longBrakeModeBtn.addEventListener("click", function () {
  state.isRestingLong = true;
  state.isWorking = false;

  DOM.buttons.shortBrakeModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.workModeBtn.style.backgroundColor = "transparent";
  DOM.buttons.timeBtnStart.disabled = false;

  clearInterval(state.countdown);
  clearInterval(state.restCountdown);
  clearInterval(state.longRestCountdown);

  if (state.isWorking) {
    updateTimer(getInput(DOM.input.timeLongRestInput.value));
    preRestingLong();
  } else if (!state.isWorking) {
    updateTimer(getInput(DOM.input.timeLongRestInput.value));
    preRestingLong();
  }
  localStorage.setItem("countdown", getInput(DOM.input.timeInput.value));
  localStorage.setItem(
    "longRestCountdown",
    getInput(DOM.input.timeLongRestInput.value),
  );
  localStorage.setItem(
    "restCountdown",
    getInput(DOM.input.timeRestInput.value),
  );
  localStorage.setItem("isWorking", state.isWorking);
  localStorage.setItem("isRestingLong", state.isRestingLong);
  saveTasks();
});

DOM.sliders.tickingVolumeSlider.oninput = function () {
  DOM.sliders.tickingValue.innerText = this.value;
  localStorage.setItem("tickingValue", this.value);
};

DOM.sliders.alarmVolumeSlider.oninput = function () {
  DOM.sliders.alarmValue.innerText = this.value;
  localStorage.setItem("alarmValue", this.value);
};

DOM.buttons.generalTaskSettings.addEventListener("click", function () {
  if (DOM.panelsAndScreens.generalTaskSettingsScreen.style.display === "none") {
    DOM.panelsAndScreens.generalTaskSettingsScreen.style.display = "flex";
  } else {
    DOM.panelsAndScreens.generalTaskSettingsScreen.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (
    !DOM.buttons.generalTaskSettings.contains(event.target) &&
    !DOM.panelsAndScreens.generalTaskSettingsScreen.contains(event.target) &&
    DOM.panelsAndScreens.generalTaskSettingsScreen.style.display === "flex"
  ) {
    DOM.panelsAndScreens.generalTaskSettingsScreen.style.display = "none";
  }
});

DOM.buttons.clearFinishedTasks.addEventListener("click", function () {
  state.taskList = state.taskList.filter((task) => !task.isChecked);
  saveTasks();
});

DOM.buttons.clearAllTasks.addEventListener("click", function () {
  state.taskList = [];
  saveTasks();
  DOM.taskContainer.innerHTML = "";
  DOM.panelsAndScreens.generalTaskSettingsScreen.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  if (state.pomodosCounter != 0) {
    DOM.pomodorosCounter.innerText = state.pomodosCounter;
  } else {
    DOM.pomodorosCounter.innerText = 1;
  }
  let acumulatedPomodoros = localStorage.getItem("acumulatedPomodoros") || 0;

  state.acumulatedPomodorosDone =
    parseInt(localStorage.getItem("acumulatedPomodorosDone")) || 0;
  DOM.acumulatedPomodorosDoneView.innerText = state.acumulatedPomodorosDone;
  DOM.acumulatedPomodorosView.innerText = acumulatedPomodoros;
  DOM.timeOfFinishingWork.innerText =
    localStorage.getItem("timeOfFinishingWork") || "00:00";

  //Load saved values from local storage

  if (state.isWorking && localStorage.getItem("workingColor")) {
    DOM.body.style.backgroundColor = localStorage.getItem("workingColor");
  } else if (
    !state.isWorking &&
    state.isRestingLong &&
    localStorage.getItem("longBrakeColor")
  ) {
    DOM.body.style.backgroundColor = localStorage.getItem("longBrakeColor");
  } else if (
    !state.isWorking &&
    !state.isRestingLong &&
    localStorage.getItem("shortBrakeColor")
  ) {
    DOM.body.style.backgroundColor = localStorage.getItem("shortBrakeColor");
  }

  //  Inputs
  DOM.input.timeInput.value = localStorage.getItem("timeInput") || 25;
  DOM.input.timeRestInput.value = localStorage.getItem("timeRestInput") || 10;
  DOM.input.timeLongRestInput.value =
    localStorage.getItem("timeLongRestInput") || 25;
  DOM.input.longBrakeIntervalInput.value =
    localStorage.getItem("longBrakeIntervalInput") || 4;
  DOM.currentProject.innerText =
    localStorage.getItem("currentProject") || "Lets work!";
  DOM.input.repeatAlarmInput.value =
    localStorage.getItem("repeatAlarmInput") || 1;

  //  Checkboxes
  if (localStorage.getItem("autoStartBreaksSlider") === "true") {
    DOM.checkboxes.autoStartBreaksCheck.checked = true;
  } else {
    DOM.checkboxes.autoStartBreaksCheck.checked = false;
  }

  if (localStorage.getItem("autoStartPomodorosSlider") === "true") {
    DOM.checkboxes.autoStartPomodorosCheck.checked = true;
  } else {
    DOM.checkboxes.autoStartPomodorosCheck.checked = false;
  }

  if (localStorage.getItem("autoCheckTasks") === "true") {
    DOM.checkboxes.autoCheckTasksCheck.checked = true;
  } else {
    DOM.checkboxes.autoCheckTasksCheck.checked = false;
  }

  if (localStorage.getItem("autoSwitchTasks") === "true") {
    DOM.checkboxes.autoSwitchTasksCheck.checked = true;
  } else {
    DOM.checkboxes.autoSwitchTasksCheck.checked = false;
  }

  if (localStorage.getItem("darkMode") === "true") {
    DOM.checkboxes.darkModeCheck.checked = true;
  } else {
    DOM.checkboxes.darkModeCheck.checked = false;
  }

  //  Dropdowns
  DOM.dropdowns.alarmSoundsDropDown.value =
    localStorage.getItem("alarmSounds") || "kitchen";
  DOM.dropdowns.tickingSoundsDropDown.value =
    localStorage.getItem("tickingSounds") || "none";
  DOM.dropdowns.hourFormatSelection.value =
    localStorage.getItem("hourFormatSelection") || "24-hour";

  //  Sliders
  DOM.sliders.alarmVolumeSlider.value =
    localStorage.getItem("alarmVolumeSlider");
  DOM.sliders.alarmValue.innerText = localStorage.getItem("alarmValue") || 50;
  DOM.sliders.tickingVolumeSlider.value = localStorage.getItem(
    "tickingVolumeSlider",
  );
  DOM.sliders.tickingValue.innerText =
    localStorage.getItem("tickingValue") || 50;

  //On-start
  let initialTime = getInput(DOM.input.timeInput.value);
  let durationCountdown = parseInt(localStorage.getItem("countdown")) || 0;
  let restDurationCountdown =
    parseInt(localStorage.getItem("restCountdown")) || 0;
  let longRestDurationCountdown =
    parseInt(localStorage.getItem("longRestCountdown")) || 0;
  state.isRestingLong = localStorage.getItem("isRestingLong");

  state.taskList.forEach(renderTask);
});
