// Get the canvas element and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants
const PLAYER_SIZE = 50;
const ENEMY_SIZE = 40;
const PLAYER_SPEED = 5;
const ENEMY_SPEED = 2;

// Player
const player = {
  x: canvas.width / 2 - PLAYER_SIZE / 2,
  y: canvas.height - 2 * PLAYER_SIZE,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
};

// Enemies
const enemies = [];

function createEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - ENEMY_SIZE),
    y: 0 - ENEMY_SIZE,
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
  };
  enemies.push(enemy);
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player movement
  if (rightPressed && player.x < canvas.width - PLAYER_SIZE) {
    player.x += PLAYER_SPEED;
  }
  if (leftPressed && player.x > 0) {
    player.x -= PLAYER_SPEED;
  }

  // Enemy movement and creation
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += ENEMY_SPEED;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    }
  }

  if (Math.random() < 0.02) {
    createEnemy();
  }

  // Collision detection
  for (let i = 0; i < enemies.length; i++) {
    if (
      player.x < enemies[i].x + ENEMY_SIZE &&
      player.x + PLAYER_SIZE > enemies[i].x &&
      player.y < enemies[i].y + ENEMY_SIZE &&
      player.y + PLAYER_SIZE > enemies[i].y
    ) {
      // Handle collision (game over or score update)
    }
  }

  // Draw everything
  // ...

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Handle user input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start the game loop
gameLoop();
