const countdownDisplay = document.getElementById("countdownDisplay");
const pomodorosCounter = document.getElementById("pomodorosCounter");
const timeInput = document.getElementById("timeInput");
const timeRestInput = document.getElementById("timeRestInput");
const timeBtnStart = document.getElementById("timeBtnStart");
const timeBtnFF = document.getElementById("timeBtnFF");
const timeBtnPause = document.getElementById("timeBtnPause");
const settings = document.getElementById("settings");
const exitSettingsButton = document.getElementById("exit-settings");
const settingsScreen = document.getElementsByClassName("settings-screen")[0];
const body = document.getElementsByTagName("BODY")[0];
const taskInput = document.getElementById("taskInput");
const amountOfPomodorosInput = document.getElementById("amountOfPomodorosInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("container-for-tasks");
const tasks = document.querySelectorAll("task");

let countdown;
let restCountdown;
let isPaused = false;
let pomodosCounter = 1;
let isWorking = true;
let numberOfTasks = 0;

  //Load saved values from local storage
  timeInput.value = localStorage.getItem("timeInput") || "";
  timeRestInput.value = localStorage.getItem("timeRestInput");

  //This is used to update the display value on input 
  timeInput.addEventListener("input", function () {
    const duration = getInput(timeInput.value);
    if (duration !== null) {
      updateDisplay(duration);
    }
  });

  //Begining value that is hown on the screen Its below the localStorage because it uses it
  countdownDisplay.value = updateDisplay(parseInt(timeInput.value * 60));

  //Save input values to local storage on change
  timeInput.addEventListener("input", function () {
    localStorage.setItem("timeInput", timeInput.value);
  });

  timeRestInput.addEventListener("input", function () {
    localStorage.setItem("timeRestInput", timeRestInput.value);
  });

  //Getting the input for work duration
  function getInput(input) {
    const duration = parseInt(input)
    if (isNaN(duration) || duration <= 0) {
      alert("Please enter a right amount of minutes for work");
      return null;
    }
    return input * 60
  }

  //Timer code and all the logic about it 
 function Timer(duration,restDuration){
  if(isWorking){
    updateDisplay(duration)
    updatePomodorosDone();
    countdown = setInterval(function(){
      if(!isPaused){
        duration--;
        updateDisplay(duration)
        working();
      }

      if(duration == 0){
        clearInterval(countdown)
        isWorking = false;
        preResting();
        updateDisplay(getInput(restDuration));
      }
    },1000)
  }else if(!isWorking){
    restCountdown = setInterval(function(){
      if(!isPaused){
        restDuration--;
        resting();
        updateDisplay(restDuration);
      }

      if(restDuration == 0){
        clearInterval(restCountdown);
        isWorking = true;
        preWorking();
        updateDisplay(getInput(duration));
      }
    },1000)
  }
 }


  function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}


  function updateDisplay(time) {
    countdownDisplay.innerText = formatTime(time);
  }

  function updatePomodorosDone(){
    pomodorosCounter.innerText = `#${pomodosCounter++}`;
  }

  settings.addEventListener("click", function () {
    settingsScreen.style.display = "block";
  });

  exitSettingsButton.addEventListener("click", function () {
    settingsScreen.style.display = "none";
  });

  //Starting the timer
  timeBtnStart.addEventListener("click", function () {
    Timer(getInput(timeInput.value),getInput(timeRestInput.value));
  });

  //Actions that the Fast Foward button does 
  timeBtnFF.addEventListener("click", function () {
    const duration = getInput(timeInput.value);
    const restDuration = getInput(timeRestInput.value);
    
    if (isWorking) {
      clearInterval(countdown);
      updateDisplay(restDuration);
      preResting();
      isWorking = false;
    } else if (!isWorking) {
      clearInterval(restCountdown);
      updateDisplay(duration);
      preWorking();
      isWorking = true;
    }
  });

  //These are the states of the timer in the app
  function preWorking(){
    body.style.backgroundColor = "indianred";
    timeBtnStart.style.display = "block";
    timeBtnFF.style.display = "none";
    timeBtnPause.style.display = "none";
  }

  function working() {
    body.style.backgroundColor = "black";
    timeBtnStart.style.display = "none";
    timeBtnFF.style.display = "block";
    timeBtnPause.style.display = "block";
  }

  function preResting(){
    timeBtnStart.style.display = "block";
    timeBtnFF.style.display = "none";
    timeBtnPause.style.display = "none";
    body.style.backgroundColor = "green";
  }

  function resting() {
    body.style.backgroundColor = "green";
    timeBtnStart.style.display = "none";
    timeBtnFF.style.display = "block";
    timeBtnPause.style.display = "block";
  }

  //Code for pausing

  timeBtnPause.addEventListener("click", function () {
    if (isPaused) {
      resumeCountdown();
    } else {
      pauseCountdown();
    }
  });

  function pauseCountdown() {
    isPaused = true;
    timeBtnPause.innerText = "Resume";
    body.style.backgroundColor = "indianred";
  }

  function resumeCountdown() {
    isPaused = false;
    timeBtnPause.innerText = "Pause";
    body.style.backgroundColor = "black";
  }

  //task addition code

  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim(); // Getting the input value and trimming whitespace
    const pomodorosNeeded = amountOfPomodorosInput.value;
    if (taskText !== "" && pomodorosNeeded !== "" && pomodorosNeeded > 0) {
      taskContainer.children[numberOfTasks].style.display = "flex";
      let taskContent = taskContainer.children[numberOfTasks].querySelectorAll('p');
      taskContent[0].innerText = taskText;
      taskContent[1].innerText = pomodorosNeeded;
      numberOfTasks++
      
    }
  });

  

  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTaskBtn.click();
    }
  });

