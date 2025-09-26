// Initialize canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Initialize snake variables
var snakeSize = 10;
var snake = [];
var snakeLength = 5;
var snakeX = canvas.width / 2;
var snakeY = canvas.height / 2;
var snakeSpeed = 10;
var snakeDirection = "right";

// Initialize food variables
var foodX = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
var foodY = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

// Initialize game variables
var gameRunning = true;
var state = "";
var score = 0;

// Add initial snake segments
for (var i = 0; i < snakeLength; i++) {
  snake.push({ x: snakeX - i * snakeSize, y: snakeY });
}

// Draw snake and food
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (var i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#092";
    ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
  }

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.fillRect(foodX, foodY, snakeSize, snakeSize);
}

// Update snake position
function update() {
  // Move snake
  switch (snakeDirection) {
    case "up":
      snakeY -= snakeSpeed;
      break;
    case "down":
      snakeY += snakeSpeed;
      break;
    case "left":
      snakeX -= snakeSpeed;
      break;
    case "right":
      snakeX += snakeSpeed;
      break;
  }

  // Check for collision with food
  if (snakeX == foodX && snakeY == foodY) {
    // Increase snake length
    snakeLength++;

    // Generate new food position
    foodX = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    foodY = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

    // Increase score
    score++;
    document.getElementById("score").innerHTML = "Score: " + score;
  }

  // Check for collision with edges
  if (
    snakeX < 0 ||
    snakeX > canvas.width - snakeSize ||
    snakeY < 0 ||
    snakeY > canvas.height - snakeSize
  ) {
    // Stop game
    gameRunning = false;

    // Set state message
    state = "Game Over! Your score is " + score;

    // Display state message
    document.getElementById("state").innerHTML = state;

    // Display replay button
    var replayButton = document.createElement("button");
    replayButton.innerHTML = "Replay";
    replayButton.id = "replay";
    replayButton.addEventListener("click", function () {
      // Reset game state
      snakeLength = 5;
      snakeX = canvas.width / 2;
      snakeY = canvas.height / 2;
      snakeDirection = "right";
      snake = [];
      for (var i = 0; i < snakeLength; i++) {
        snake.push({ x: snakeX - i * snakeSize, y: snakeY });
      }
      foodX =
        Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
      foodY =
        Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
      gameRunning = true;
      score = 0;
      state = "";
      document.getElementById("score").innerHTML = "Score: " + score;
      document.getElementById("state").innerHTML = state;
      document.body.removeChild(replayButton);
      gameLoop();
    });
    document.body.appendChild(replayButton);
  }

  // Add new snake segment
  snake.unshift({ x: snakeX, y: snakeY });

  // Remove last snake segment if snake is too long
  if (snake.length > snakeLength) {
    snake.pop();
  }
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "w":
      if (snakeDirection != "down") {
        snakeDirection = "up";
      }
      break;
    case "s":
      if (snakeDirection != "up") {
        snakeDirection = "down";
      }
      break;
    case "a":
      if (snakeDirection != "right") {
        snakeDirection = "left";
      }
      break;
    case "d":
      if (snakeDirection != "left") {
        snakeDirection = "right";
      }
      break;
  }
});

// Game loop
function gameLoop() {
  if (gameRunning) {
    update();
    draw();
    setTimeout(gameLoop, 100);
  }
}

// Start game loop
gameLoop();
