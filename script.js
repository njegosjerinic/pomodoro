const tasks = document.querySelectorAll("task");
const settings = document.getElementById("settings");
const body = document.getElementsByTagName("BODY")[0];
const timeInput = document.getElementById("timeInput");
const taskInput = document.getElementById("taskInput");
const timeBtnFF = document.getElementById("timeBtnFF");
const addTaskBtn = document.getElementById("addTaskBtn");
const timeBtnPause = document.getElementById("timeBtnPause");
const timeBtnStart = document.getElementById("timeBtnStart");
const timeRestInput = document.getElementById("timeRestInput");
const exitSettingsButton = document.getElementById("exit-settings");
const countdownDisplay = document.getElementById("countdownDisplay");
const taskContainer = document.getElementById("container-for-tasks");
const pomodorosCounter = document.getElementById("pomodorosCounter");
const settingsScreen = document.getElementsByClassName("settings-screen")[0];
const amountOfPomodorosInput = document.getElementById("amountOfPomodorosInput");
const createTask = document.getElementById('createTask');
const cancelCreation = document.getElementById('cancelCreation');
const addTaskPanel = document.getElementById('addTaskPanel');
const input = document.getElementById('inputTime');
const overlay = document.getElementById('overlay');
const audio = new Audio("audiomass-output.mp3");
const title = document.getElementById("title");

let countdown;
let restCountdown;
let isPaused = false;
let isWorking = true;
let numberOfTasks = 0;
let pomodosCounter = 1;


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

  //Load saved values from local storage
  timeInput.value = localStorage.getItem("timeInput") || "";
  timeRestInput.value = localStorage.getItem("timeRestInput");

  

  //This is used to update the display value on input 
  input.addEventListener("click", function () {
    const duration = getInput(timeInput.value);
    if (duration !== null) {
      updateTimer(duration);
      settingsScreen.style.display = "none";
      overlay.style.display = "none";
    }
  });

  //Begining value that is hown on the screen Its below the localStorage because it uses it
  countdownDisplay.value = updateTimer(parseInt(timeInput.value * 60));


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
    return input * 60;
  }

  //Timer code and all the logic about it 
 function Timer(duration,restDuration){
  if(isWorking){
    updateTimer(duration)
    updatePomodorosCounter();
    updatePomodorosCounterPerTask();
    countdown = setInterval(function(){
      if(!isPaused){
        duration--;
        updateTimer(duration)
        working();
      }

      if(duration == 0){
        audio.play();
        clearInterval(countdown)
        isWorking = false;
        preResting();
        updateTimer(restDuration);
      }
    },1000)
  }else if(!isWorking){
    restCountdown = setInterval(function(){
      if(!isPaused){
        restDuration--;
        resting();
        updateTimer(restDuration);
      }

      if(restDuration == 0){
        audio.play();
        clearInterval(restCountdown);
        isWorking = true;
        preWorking();
        updateTimer(duration);
      }
    },1000)
  }
 }




  function updateTimer(time) {
    countdownDisplay.innerText = formatTime(time);
  }

  function updatePomodorosCounter(){
    pomodorosCounter.innerText = `#${pomodosCounter++}`;
    taskList.forEach(task => {
      if(task.isActive){
        task.donePomodoros++;
      }
    })
  }

  settings.addEventListener("click", function () {
    settingsScreen.style.display = "block";
    overlay.style.display = 'block';
  });

  exitSettingsButton.addEventListener("click", function () {
    settingsScreen.style.display = "none";
    overlay.style.display = 'none';
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
      updateTimer(restDuration);
      preResting();
      isWorking = false;
    } else{
      clearInterval(restCountdown);
      updateTimer(duration);
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
    taskContainer.style.display = "block";
    addTaskBtn.style.display = "block";
  }

  function working() {
    body.style.backgroundColor = "black";
    timeBtnStart.style.display = "none";
    timeBtnFF.style.display = "block";
    timeBtnPause.style.display = "block";
    taskContainer.style.display = "none";
    addTaskBtn.style.display = "none";
    title.style.display = "none";
  }

  function preResting(){
    timeBtnStart.style.display = "block";
    timeBtnFF.style.display = "none";
    timeBtnPause.style.display = "none";
    body.style.backgroundColor = "green";
    taskContainer.style.display = "block";
    addTaskBtn.style.display = "block";
  }

  function resting() {
    body.style.backgroundColor = "green";
    timeBtnStart.style.display = "none";
    timeBtnFF.style.display = "block";
    timeBtnPause.style.display = "block";
    taskContainer.style.display = "block";
    addTaskBtn.style.display = "block";
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
    body.style.backgroundColor = "rgb(186, 73, 73)";
    taskContainer.style.display = "flex";
    addTaskBtn.style.display = "block";
    title.style.display = "block";
    timeBtnPause.style.background = "white";
    timeBtnPause.style.borderRadius = "5px";
    timeBtnPause.style.color = "indianred"
  }

  function resumeCountdown() {
    isPaused = false;
    timeBtnPause.innerText = "Pause";
    body.style.backgroundColor = "black";
    taskContainer.style.display = "none";
    addTaskBtn.style.display = "none";
    title.style.display = "none";
    timeBtnPause.style.background = "transparent";
    timeBtnPause.style.color = "white";
  }

  //JSON of tasks made in object form
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(taskList))
  }

  //This renders the Tasks
  function renderTask(task){
    let {id, name, pomodorosToDo, donePomodoros, isActive} = task;

      const taskDiv = document.createElement("div");
      taskDiv.dataset.id = id;
      taskDiv.className = "task"

      const taskDesc = document.createElement("p");
      taskDesc.innerText = name;

      const taskTime = document.createElement("p");
      taskTime.innerText = `${donePomodoros} / ${pomodorosToDo}`;
      
      if(isActive){
        taskDiv.className = ('task active');
      }

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "X";
      deleteButton.id = `button-${Date.now()}`;

      deleteButton.addEventListener('click',e =>{
        e.stopPropagation();
        taskContainer.removeChild(taskDiv);
        taskList = taskList.filter(t => t.id !== id);
        saveTasks();
      })

      taskDiv.addEventListener('click', () => {
        if(taskDiv.classList.contains('active')) return;

        document.querySelectorAll('.task.active').forEach(el => 
          el.classList.remove('active')
        );

        taskDiv.classList.add('active');


        taskList.forEach(t => t.isActive = false);
        task.isActive = true;

        taskTime.innerText = `${task.donePomodoros} / ${pomodorosToDo}`;
        saveTasks();
      })

      taskDiv.append(taskDesc, taskTime, deleteButton)
      taskContainer.appendChild(taskDiv)
      
  }

  function addTask(){
    const name = taskInput.value.trim();
    const pomodorosToDo = parseInt(amountOfPomodorosInput.value, 10);

    if (!name || isNaN(pomodorosToDo) || pomodorosToDo <= 0) {
      alert('Please enter a task name and a positive number of Pomodoros.');
      return;
    }
  

  const newTask = {
    id : `task-${Date.now()}`,
    name,
    pomodorosToDo,
    donePomodoros:0,
    isActive : false
  }

  taskList.push(newTask);
  saveTasks();
  renderTask(newTask);

  taskInput.value = '';
  amountOfPomodorosInput.value = '';
  
  }

  function updatePomodorosCounterPerTask(){
    taskContainer.innerHTML = '';

  // 2) re‑render each task
    taskList.forEach(renderTask);
  }


  addTaskBtn.addEventListener('click', function(){
    addTaskPanel.style.display = "flex";
    addTaskBtn.style.display = "none";
  });

  cancelCreation.addEventListener('click',function(){
    addTaskPanel.style.display = "none";
    addTaskBtn.style.display = "block";

  })

  createTask.addEventListener('click', addTask);
  
  window.addEventListener('DOMContentLoaded', () => {
    taskList.forEach(renderTask)
  })
  

