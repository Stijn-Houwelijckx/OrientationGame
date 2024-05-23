// Import Player class
import Player from "./Classes/Player.js";

var checkpointRadius = 100;
var checkPointCounter = 0;

// Checkpoints
const checkpoints = [
  { x: -1544, y: -2027, message: "Checkpoint 0", check: 0 },
  { x: -820, y: -368, message: "Checkpoint 1", check: 1 },
  { x: -3810, y: -705, message: "Checkpoint 2", check: 2 },
  { x: -2028, y: 208, message: "Checkpoint 3", check: 3 },
  { x: 322, y: 50, message: "Checkpoint 4", check: 4 },
  { x: -366, y: -1633, message: "Checkpoint 5", check: 5 },
  { x: -1192, y: -3187, message: "Checkpoint 6", check: 6 },
  { x: 597, y: -3637, message: "Checkpoint 7", check: 7 },
  { x: -1827, y: -4056, message: "Checkpoint 8", check: 8 },
  { x: -3801, y: -3167, message: "Checkpoint 9", check: 9 },
  { x: -2232, y: -1410, message: "Checkpoint 10", check: 10 },
  { x: -1544, y: -2027, message: "Finish", check: 11 },
];

// Log device orientation data for testing
// console.log(deviceOrientationData);

// Disable touchmove event to prevent scrolling by touch
document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

// Get canvas element and its context
let canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerSize = 75; // Adjust the size of the player if needed

// Create a new instance of the Player class
const player = new Player(canvas.width / 2 - 37, canvas.height / 2 - 37);

var offsetX = 0;
var offsetY = 0;

function centerScreenOnPlayer() {
  offsetX =
    document.documentElement.clientWidth / 2 - player.x - playerSize / 2;
  offsetY =
    document.documentElement.clientHeight / 2 - player.y - playerSize / 2;

  document.getElementById("gameContainer").style.marginLeft = offsetX + "px";
  document.getElementById("gameContainer").style.marginTop = offsetY + "px";

  // console.log("x: " + offsetX.toFixed(2) + " " + "y: " + offsetY.toFixed(2));
}

console.log(document.documentElement.clientWidth);
console.log(document.documentElement.clientHeight);

console.log("calculated width: " + document.documentElement.clientWidth / 1920);
console.log(
  "calculated height: " + document.documentElement.clientHeight / 945
);

// Set checkpoint based on screen size
function setCheckpoints() {
  const originalCenterX = 1920 / 2;
  const originalCenterY = 945 / 2;

  const currentCenterX = document.documentElement.clientWidth / 2;
  const currentCenterY = document.documentElement.clientHeight / 2;

  const deltaX = currentCenterX - originalCenterX;
  const deltaY = currentCenterY - originalCenterY;

  checkpoints.forEach((checkpoint) => {
    checkpoint.x += deltaX;
    checkpoint.y += deltaY;

    console.log(checkpoint.x + " " + checkpoint.y);
  });
}

// If fist movement, start timer
document.addEventListener("keydown", function () {
  if (startTime === null) {
    startTimer();
  }
});

// If first movement, start timer

// Main game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);

  player.update(canvas.width, canvas.height);

  centerScreenOnPlayer();

  document.querySelector(".position .posX").innerHTML = offsetX.toFixed(2);
  document.querySelector(".position .posY").innerHTML = offsetY.toFixed(2);

  checkpoint(offsetX, offsetY);
}

// Select the timer element
const timerElement = document.querySelector(".timer");

let startTime = null;
let timer = null;

function startTimer() {
  startTime = Date.now();

  timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = elapsedTime % 1000;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    const formattedMilliseconds = String(milliseconds).padStart(3, "0");

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
  }, 1);
}

// Reset the timer
function resetTimer() {
  clearInterval(timer);
  timerElement.textContent = "00:00:000";
  startTime = null;
}

var fastestLapElement = document.querySelector(".fastestLapNr");
var fastestLapTime = "00:00:000";

function checkpoint(playerX, playerY) {
  checkpoints.forEach((checkpoint) => {
    const distance = Math.sqrt(
      Math.pow(checkpoint.x - playerX, 2) + Math.pow(checkpoint.y - playerY, 2)
    );

    if (distance < checkpointRadius) {
      // console.log(checkpoint.message);
      if (checkpoint.check == checkPointCounter) {
        console.log("Checkpoint " + checkPointCounter + " reached");
        document.querySelector(".checkpointText").innerHTML =
          checkpoint.message;
        checkPointCounter++;

        if (checkPointCounter == checkpoints.length) {
          console.log("Game finished");
          document.querySelector(".checkpointText").innerHTML = "Game finished";

          const elapsedTime = Date.now() - startTime;
          const minutes = Math.floor(elapsedTime / 60000);
          const seconds = Math.floor((elapsedTime % 60000) / 1000);
          const milliseconds = elapsedTime % 1000;

          const formattedMinutes = String(minutes).padStart(2, "0");
          const formattedSeconds = String(seconds).padStart(2, "0");
          const formattedMilliseconds = String(milliseconds).padStart(3, "0");

          const lapTime = `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;

          if (fastestLapTime == "00:00:000") {
            fastestLapTime = lapTime;
            fastestLapElement.innerHTML = fastestLapTime;
          } else {
            const lapTimeInMilliseconds =
              minutes * 60000 + seconds * 1000 + milliseconds;
            const fastestLapTimeInMilliseconds =
              parseInt(fastestLapTime.split(":")[0]) * 60000 +
              parseInt(fastestLapTime.split(":")[1]) * 1000 +
              parseInt(fastestLapTime.split(":")[2]);

            if (lapTimeInMilliseconds < fastestLapTimeInMilliseconds) {
              fastestLapTime = lapTime;
            }

            fastestLapElement.innerHTML = fastestLapTime;
          }

          player.x = canvas.width / 2 - 37;
          player.y = canvas.height / 2 - 37;

          resetTimer();

          checkPointCounter = 0;
        }
      }
    }
  });
}

// Handle device orientation
function handleDeviceOrientation() {
  // Access rotation data from deviceOrientationData
  const { alpha, beta, gamma } = deviceOrientationData;

  if (startTime === null && deviceOrientationData.alpha != 0) {
    startTimer();
  }

  // console.log(alpha, beta, gamma);

  // Convert rotation data to movement direction
  const moveX = gamma > 10 ? 1 : gamma < -10 ? -1 : 0;
  const moveY = beta > 10 ? 1 : beta < -10 ? -1 : 0;

  // Update player's direction
  player.setDirection("up", moveY === -1);
  player.setDirection("down", moveY === 1);
  player.setDirection("left", moveX === -1);
  player.setDirection("right", moveX === 1);
}

// Handle arrow key events
function handleArrowKeys(event) {
  const { keyCode } = event;

  switch (keyCode) {
    case 37: // Left arrow key
      player.setDirection("left", true);
      break;
    case 38: // Up arrow key
      player.setDirection("up", true);
      break;
    case 39: // Right arrow key
      player.setDirection("right", true);
      break;
    case 40: // Down arrow key
      player.setDirection("down", true);
      break;
    default:
      break;
  }
}

// Handle keyup events

function handleKeyUp(event) {
  const { keyCode } = event;

  switch (keyCode) {
    case 37: // Left arrow key
      player.setDirection("left", false);
      break;
    case 38: // Up arrow key
      player.setDirection("up", false);
      break;
    case 39: // Right arrow key
      player.setDirection("right", false);
      break;
    case 40: // Down arrow key
      player.setDirection("down", false);
      break;
    default:
      break;
  }
}

// Add event listener for device orientation
// window.addEventListener("deviceorientation", handleDeviceOrientation);

// Add event listener for arrow key events
window.addEventListener("keydown", handleArrowKeys);
window.addEventListener("keyup", handleKeyUp);

// Start the game loop
gameLoop();

setCheckpoints();
