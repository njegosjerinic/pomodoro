document.addEventListener('DOMContentLoaded',function(){
    const countdownDisplay = document.getElementById('countdownDisplay');
    const pomodorosCounter = document.getElementById('pomodorosCounter');
    const timeInput = document.getElementById('timeInput');
    const timeRestInput = document.getElementById('timeRestInput');
    const timeBtnStart = document.getElementById('timeBtnStart');
    const timeBtnFF = document.getElementById('timeBtnFF');
    const timeBtnPause = document.getElementById('timeBtnPause');
    const settings = document.getElementById('settings');
    const exitSettingsButton = document.getElementById('exit-settings');
    const settingsScreen = document.getElementsByClassName("settings-screen")[0];
    const body = document.getElementsByTagName('BODY')[0];
    const taskInput = document.getElementById('taskInput');
    const amountOfPomodorosInput = document.getElementById('amountOfPomodorosInput')
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    let countdown;
    let timeRemaning;
    let restCountdown;
    let isPaused = false;
    let pomodosCounter = 1;
    let isWorking = true;
    let isResting = true;
    let restTimeRemaning;


    //Load saved values from local storage 
    timeInput.value = localStorage.getItem('timeInput') || '';
    timeRestInput.value = localStorage.getItem('timeRestInput');

    //Setting up the starting value of pomodoro
    countdownDisplay.value = updateDisplay(parseInt(timeInput.value * 60));


    //Save input values to local storage on change 
    timeInput.addEventListener('input',function(){
        localStorage.setItem('timeInput',timeInput.value);
    });

    timeRestInput.addEventListener('input',function(){
        localStorage.setItem('timeRestInput',timeRestInput.value);
    });


    //Getting the input for work duration 
   function getInputDuration(){
    const inputValue = timeInput.value;
    const duration = parseInt(inputValue * 60);
    if(isNaN(duration) || duration <= 0 ){
        alert('Please enter a right amount of minutes for work')
        return null;
    }
    return duration;
   }

   //Getting the input for rest duration 
   function getInputRestDuration(){
    const inputRestValue = timeRestInput.value;
    const restDuration = parseInt(inputRestValue * 60);
    if(isNaN(restDuration) || restDuration <= 0){
        alert('Please enter the right amount of minutes for rest');
        return null;
    }
    return restDuration;
   }


    //Making a timer for work interval
    function workTimer(duration){

    isWorking = true;

    timeRemaning = duration;
    
    updateDisplay(timeRemaning)
    
    countdown = setInterval(function(){
        if(!isPaused){
            timeRemaning--;
            updateDisplay(timeRemaning);
        }
    
        if(timeRemaning < 0){
            clearInterval(countdown);
            resting()
            updateDisplay(getInputRestDuration())
            pomodosCounter++;
            pomodorosCounter.innerHTML = `#${pomodosCounter}`;
            timeBtnStart.style.removeProperty('display');
            timeBtnFF.style.display = 'none';
            timeBtnPause.style.display = 'none';
        }
    },1000);
    }

   //Making timer for rest interval
   function restTimer(restDuration){

    isWorking = false;

    restTimeRemaning = restDuration;

    updateDisplay(restTimeRemaning);

    restCountdown = setInterval(function(){
        if(!isPaused){
            restTimeRemaning--;
            updateDisplay(restTimeRemaning);
        }

        if(restTimeRemaning < 0){
            clearInterval(restCountdown);
            updateDisplay(getInputDuration())
            body.style.backgroundColor = 'indianred';
            timeBtnStart.style.removeProperty('display');
            timeBtnFF.style.display = 'none';
            timeBtnPause.style.display = 'none';
        }
    },1000);
   }

    function updateDisplay(time){
        countdownDisplay.innerText = formatTime(time);
    }

    function formatTime(seconds){
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }


   timeInput.addEventListener('input',function(){
        const duration = getInputDuration();
        if(duration !== null){
            updateDisplay(duration);
        }
    });

    settings.addEventListener('click',function(){
        settingsScreen.style.display = "block";
    });

    exitSettingsButton.addEventListener('click',function(){
        settingsScreen.style.display = "none";
    });

    timeBtnStart.addEventListener('click',function(){
        const duration = getInputDuration();
        const restDuration = getInputRestDuration();
        timeBtnStart.style.display = 'none';
        timeBtnFF.style.display = 'block';
        timeBtnPause.style.display = 'block';
        if(isResting){
            clearInterval(restCountdown);
            workTimer(duration);
            updateDisplay(duration);
            working();
            isResting = false;
        }else if(!isResting){
            clearInterval(countdown);
            restTimer(restDuration);
            updateDisplay(restDuration);
            resting();
            isResting = true;
        }
        console.log(isResting)
    });


    timeBtnFF.addEventListener('click',function(){
        const duration = getInputDuration();
        const restDuration = getInputRestDuration();
        timeBtnStart.style.removeProperty('display');
        timeBtnFF.style.display = 'none';
        timeBtnPause.style.display = 'none';
        if(isWorking){
            clearInterval(countdown);
            updateDisplay(restDuration);
            resting();
            isWorking = false;
        }else if(!isWorking){
            clearInterval(restCountdown);
            updateDisplay(duration);
            body.style.backgroundColor = 'indianred';
            isWorking = true;
        }
    });

    function working(){
        body.style.backgroundColor = 'black';
    }

    function resting(){
        body.style.backgroundColor = 'green';

    }

    //Code for pausing

    timeBtnPause.addEventListener('click',function(){
        if(isPaused){
            resumeCountdown();
        } else{
            pauseCountdown();
        }
    });

    function pauseCountdown(){
        isPaused = true;
        timeBtnPause.innerText = "Resume";
        body.style.backgroundColor = 'indianred';
    }
    
    function resumeCountdown(){
        isPaused = false;
        timeBtnPause.innerText = "Pause";
        body.style.backgroundColor = 'black';
    }



    addTaskBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();  // Getting the input value and trimming whitespace
        const pomodorosNeeded = amountOfPomodorosInput.value;
        if (taskText !== '' && pomodorosNeeded !== '' && pomodorosNeeded > 0 ) {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `<div id="addedTask" class = "Task"><div><input type="checkbox"><p>${taskText}</p></div><div><div id="pomodosDone"></div><p>/${pomodorosNeeded}</p> <button>Del</button></div><div>`;
            taskList.appendChild(taskItem);
            taskInput.value = '';  // Clearing the input field
            amountOfPomodorosInput.value = '';
            

            taskItem.addEventListener('click', function() {
                taskItem.classList.toggle('active');
            });

            const deleteBtn = taskItem.querySelector('button');
            deleteBtn.addEventListener('click', function() {
                taskList.removeChild(taskItem);
            });

            
        }
    });

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });
    //Number of pomodoros done 

});