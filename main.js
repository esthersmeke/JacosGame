// JavaScript code goes here

// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initialize canvas size based on the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants
let PLAYER_SIZE = 90;
let UFO_SIZE = 70;
const PLAYER_SPEED = 8;
let ENEMY_SPEED = 4; // Initial UFO falling speed
const SPEED_INCREASE_INTERVAL = 10000; // 10 seconds in milliseconds
let speedIncreaseTimer = 1; // Timer to track speed increase

// Player
const player = {
  x: canvas.width / 2 - PLAYER_SIZE / 2,
  y: canvas.height - 2 * PLAYER_SIZE,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
};

// UFO icon image for enemies
const ufoImage = new Image();
ufoImage.src = "ufo.png"; // Replace with the path to your UFO image

// Rocket image for the player
const rocketImage = new Image();
rocketImage.src = "rocket.png"; // Replace with the path to your rocket image

// Enemies
const enemies = [];

function createEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - UFO_SIZE),
    y: 0 - UFO_SIZE,
    width: UFO_SIZE,
    height: UFO_SIZE,
  };
  enemies.push(enemy);
}

// Game loop
function gameLoop(timestamp) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player movement
  if (isComputer && (rightPressed || leftPressed)) {
    if (rightPressed) {
      player.x += PLAYER_SPEED;
    }
    if (leftPressed) {
      player.x -= PLAYER_SPEED;
    }
  }

  // Ensure player stays within the canvas bounds
  player.x = Math.max(0, Math.min(player.x, canvas.width - PLAYER_SIZE));

  // Enemy movement and creation
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += ENEMY_SPEED;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    }
  }

  // Create more UFOs every 40 seconds
  if (timestamp - lastUFOAppearance > SPEED_INCREASE_INTERVAL) {
    ENEMY_SPEED += 1; // Increase the UFO falling speed
    lastUFOAppearance = timestamp;
  }

  if (Math.random() < 0.04) {
    createEnemy();
  }

  // Collision detection
  for (let i = 0; i < enemies.length; i++) {
    if (
      player.x < enemies[i].x + UFO_SIZE &&
      player.x + PLAYER_SIZE > enemies[i].x &&
      player.y < enemies[i].y + UFO_SIZE &&
      player.y + PLAYER_SIZE > enemies[i].y
    ) {
      // Handle collision (game over or score update)
      document.location.reload();
    }
  }

  // Draw player as a larger rocket
  ctx.drawImage(rocketImage, player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

  // Draw enemies as UFO icons
  for (const enemy of enemies) {
    ctx.drawImage(ufoImage, enemy.x, enemy.y, UFO_SIZE, UFO_SIZE);
  }

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Handle touch controls
let touchStartX = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;

  if (deltaX > 0) {
    // Move right
    rightPressed = true;
    leftPressed = false;
  } else if (deltaX < 0) {
    // Move left
    leftPressed = true;
    rightPressed = false;
  }
});

canvas.addEventListener("touchend", () => {
  // Stop moving when touch is released
  leftPressed = false;
  rightPressed = false;
});

// Keyboard arrow controls for computers
let leftPressed = false;
let rightPressed = false;
let isComputer = true;

function handleKeyDown(e) {
  if (e.key === "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  } else if (e.key === "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  }
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") {
    leftPressed = false;
  } else if (e.key === "ArrowRight") {
    rightPressed = false;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Detect if it's a mobile device
if (window.innerWidth <= 600) {
  isComputer = false;
}

// Update canvas size when the window is resized
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start the game loop
let lastUFOAppearance = 0; // Timestamp of the last UFO appearance
gameLoop();
