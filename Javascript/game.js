// Import Player class
import Player from "./Classes/Player.js";
import Enemy from "./Classes/Enemy.js";

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
const player = new Player(canvas.width / 2, canvas.height / 2);
let enemies = [];

// Create a new instance of the Enemy class
for (let i = 0; i < 5; i++) {
  const enemy = new Enemy(
    Math.random() * canvas.width,
    Math.random() * canvas.height
  );
  enemies.push(enemy);
}

function centerScreenOnPlayer() {
  const offsetX =
    document.documentElement.clientWidth / 2 - player.x - playerSize / 2;
  const offsetY =
    document.documentElement.clientHeight / 2 - player.y - playerSize / 2;

  document.body.style.marginLeft = offsetX + "px";
  document.body.style.marginTop = offsetY + "px";
}

// Main game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);

  player.update(canvas.width, canvas.height);
  enemies.forEach((enemy) => {
    enemy.update();
  });

  centerScreenOnPlayer();
}

// Handle device orientation
function handleDeviceOrientation() {
  // Access rotation data from deviceOrientationData
  const { alpha, beta, gamma } = deviceOrientationData;

  console.log(alpha, beta, gamma);

  // Convert rotation data to movement direction
  const moveX = gamma > 10 ? 1 : gamma < -10 ? -1 : 0;
  const moveY = beta > 10 ? 1 : beta < -10 ? -1 : 0;

  // Update player's direction
  player.setDirection("up", moveY === -1);
  player.setDirection("down", moveY === 1);
  player.setDirection("left", moveX === -1);
  player.setDirection("right", moveX === 1);
}

// Add event listener for device orientation
window.addEventListener("deviceorientation", handleDeviceOrientation);

// Start the game loop
gameLoop();
