// Get references to the start screen and game canvas
const startScreen = document.getElementById("startScreen");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Initialize canvas size based on the window size
resizeCanvas();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Call resizeCanvas when the window is resized
window.addEventListener("resize", resizeCanvas);

// Get the "START" button
const startButton = document.getElementById("startButton");

// Hide the game canvas initially
canvas.style.display = "none";

// Constants
let PLAYER_SIZE = 90;
let UFO_SIZE = 70;
const PLAYER_SPEED = 8;
let ENEMY_SPEED = 4; // Initial UFO falling speed
const SPEED_INCREASE_INTERVAL = 10000; // 10 seconds in milliseconds
let speedIncreaseTimer = 1; // Timer to track speed increase
let lastUFOAppearance = 0; // Initialize lastUFOAppearance

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

// Bullets
const bullets = [];

// Function to handle player shooting
function shoot() {
  const bullet = {
    x: player.x + PLAYER_SIZE / 2,
    y: player.y,
    width: 5, // Adjust the bullet size as needed
    height: 10, // Adjust the bullet size as needed
  };
  bullets.push(bullet);
}

// Function to update and draw bullets
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 10; // Adjust the bullet speed as needed

    // Remove bullets that go off the screen
    if (bullets[i] && bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Collision detection between bullets and enemies
function checkBulletEnemyCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (
        bullets[i] &&
        enemies[j] &&
        bullets[i].x < enemies[j].x + UFO_SIZE &&
        bullets[i].x + bullets[i].width > enemies[j].x &&
        bullets[i].y < enemies[j].y + UFO_SIZE &&
        bullets[i].y + bullets[i].height > enemies[j].y
      ) {
        // Remove the bullet and the enemy on collision
        bullets.splice(i, 1);
        i--;
        enemies.splice(j, 1);
        j--;
      }
    }
  }
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

  // Player shooting logic
  if (isComputer && spacePressed) {
    shoot();
  }

  // Update and draw bullets
  updateBullets();

  // Check for bullet-enemy collisions
  checkBulletEnemyCollisions();

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

  // Draw bullets
  for (const bullet of bullets) {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
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
let spacePressed = false;
let isComputer = true;

// Boolean to track if the spacebar is currently held down
let spaceKeyDown = false;

function handleKeyDown(e) {
  if (e.key === "ArrowLeft") {
    leftPressed = true;
    rightPressed = false;
  } else if (e.key === "ArrowRight") {
    rightPressed = true;
    leftPressed = false;
  } else if (e.key === " ") {
    if (!spaceKeyDown) {
      spacePressed = true;
      spaceKeyDown = true;
      shoot();
    }
  }
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") {
    leftPressed = false;
  } else if (e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === " ") {
    spacePressed = false;
    spaceKeyDown = false; // Set it to false when spacebar is released
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

// Event listener to start the game when the "START" button is clicked
startButton.addEventListener("click", () => {
  startScreen.style.display = "none"; // Hide the start screen
  canvas.style.display = "block"; // Display the game canvas

  // Start the game loop
  requestAnimationFrame(gameLoop);
});