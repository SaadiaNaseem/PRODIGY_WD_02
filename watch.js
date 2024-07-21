let startTime;
let updatedTime;
let tInterval;
let savedTime = 0;
let running = false;
let lapCounter = 0;

const display = document.getElementById('display');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapsList = document.getElementById('laps-list');

let lapMTPDiff;

function lapDiff(time1, time2) {
    time1 = time1.split(":");
    time2 = time2.split(":");

    let time1InSeconds = parseInt(time1[0]) * 3600 + parseInt(time1[1]) * 60 + parseInt(time1[2]);
    let time2InSeconds = parseInt(time2[0]) * 3600 + parseInt(time2[1]) * 60 + parseInt(time2[2]);

    let timeDiffInSeconds = time1InSeconds - time2InSeconds;

    let timeDiffHours = Math.floor(timeDiffInSeconds / 3600);
    timeDiffInSeconds %= 3600;
    let timeDiffMinutes = Math.floor(timeDiffInSeconds / 60);
    let timeDiffSeconds = timeDiffInSeconds % 60;

    lapMTPDiff = `${timeDiffHours > 9 ? timeDiffHours : "0" + timeDiffHours}:${
        timeDiffMinutes > 9 ? timeDiffMinutes : "0" + timeDiffMinutes
    }:${timeDiffSeconds > 9 ? timeDiffSeconds : "0" + timeDiffSeconds}`;
}

// Event listeners for buttons
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', recordLap);

// Function to toggle between start and stop ++this add
function toggleTimer() {
    if (running) {
        stopTimer();
        startButton.innerHTML = 'Start';
    } else {
        startTimer();
        startButton.innerHTML = 'Stop';
    }
}
// Function to start the timer
function startTimer() {
    if (!running) {
        startTime = new Date().getTime() - savedTime;
        tInterval = setInterval(updateTime, 10);
        running = true;
    }
}

// Function to stop the timer
function stopTimer() {
    if (running) {
        clearInterval(tInterval);
        savedTime = new Date().getTime() - startTime;
        running = false;
    }
}

// Function to reset the timer
function resetTimer() {
    clearInterval(tInterval);
    display.innerHTML = '00:00:00';
    savedTime = 0;
    running = false;
    lapCounter = 0;
    lapsList.innerHTML = '';
    lapsList.classList.remove('laps-list-active');
    startButton.addEventListener('click', toggleTimer);

}

// Function to update the display
function updateTime() {
    updatedTime = new Date().getTime() - startTime;
    let hours = Math.floor((updatedTime / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((updatedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((updatedTime / 1000) % 60);

    // Format time as HH:MM:SS
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    display.innerHTML = hours + ":" + minutes + ":" + seconds;
}

// Function to record a lap
function recordLap() {
    if (running) {
        const lapTime = display.innerHTML;
        let lapMTP;
        if (lapsList.innerHTML == "") {
            lapMTP = lapTime;
        } else {
            const laps = lapsList.querySelectorAll("li");
            const lastLap = laps[laps.length - 1];
            const lastLapTime = lastLap.querySelector(".time").textContent;
            lapMTP = lastLapTime.replace("+", "");
            lapDiff(display.innerHTML, lastLapTime);
            lapMTP = lapMTPDiff;
        }
        const lapItem = document.createElement('li');
        lapItem.className = "lap";
        lapItem.innerHTML = `<span class="time">${lapTime}</span><span class="mtp">+${lapMTP}</span>`;
        lapsList.appendChild(lapItem);

        // Add the class to display the border when the lap button is pressed
        lapsList.classList.add('laps-list-active');
    }
}
