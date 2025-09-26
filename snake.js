 // Initialize canvas and context
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        
        // Set canvas dimensions based on device
        function resizeCanvas() {
            const gameArea = document.querySelector('.game-area');
            const maxWidth = Math.min(gameArea.clientWidth - 20, gameArea.clientHeight - 20, 500);
            canvas.width = maxWidth;
            canvas.height = maxWidth;
        }
        
        // Initialize snake variables
        var snakeSize = 10;
        var snake = [];
        var snakeLength = 5;
        var snakeX, snakeY;
        var snakeDirection = "right";
        var nextDirection = "right";
        
        // Initialize food variables
        var foodX, foodY;
        
        // Initialize game variables
        var gameRunning = true;
        var state = "";
        var score = 0;
        var gameLoopId;
        var lastUpdateTime = 0;
        
        // Speed control variables
        var baseSpeed = 150; // Base delay in milliseconds
        var currentSpeed = baseSpeed;
        
        // Add initial snake segments
        function initSnake() {
            snake = [];
            // Ensure starting position is aligned to grid
            snakeX = Math.floor(canvas.width / (2 * snakeSize)) * snakeSize;
            snakeY = Math.floor(canvas.height / (2 * snakeSize)) * snakeSize;
            for (var i = 0; i < snakeLength; i++) {
                snake.push({ x: snakeX - i * snakeSize, y: snakeY });
            }
        }
        
        // Initialize food
        function initFood() {
            foodX = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
            foodY = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
        }
        
        // Draw snake and food
        function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid background
            ctx.strokeStyle = "rgba(76, 201, 240, 0.1)";
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= canvas.width; x += snakeSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += snakeSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            // Draw snake
            for (var i = 0; i < snake.length; i++) {
                // Head is a different color
                if (i === 0) {
                    ctx.fillStyle = "#4cc9f0";
                } else {
                    // Gradient body
                    const colorValue = 100 + Math.floor((i / snake.length) * 100);
                    ctx.fillStyle = `rgb(0, ${colorValue}, 0)`;
                }
                ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
                
                // Add border to snake segments
                ctx.strokeStyle = "#0d1b2a";
                ctx.lineWidth = 1;
                ctx.strokeRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
            }
            
            // Draw food
            ctx.fillStyle = "#ff6b6b";
            ctx.beginPath();
            ctx.arc(foodX + snakeSize/2, foodY + snakeSize/2, snakeSize/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Add shine to food
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.beginPath();
            ctx.arc(foodX + snakeSize/3, foodY + snakeSize/3, snakeSize/6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Update snake position
        function update() {
            // Update direction only after moving to prevent 180-degree turns
            snakeDirection = nextDirection;
            
            // Move snake by exact grid size (10 pixels)
            switch (snakeDirection) {
                case "up":
                    snakeY -= snakeSize;
                    break;
                case "down":
                    snakeY += snakeSize;
                    break;
                case "left":
                    snakeX -= snakeSize;
                    break;
                case "right":
                    snakeX += snakeSize;
                    break;
            }
            
            // Check for collision with food
            if (snakeX === foodX && snakeY === foodY) {
                // Increase snake length
                snakeLength++;
                
                // Generate new food position (avoiding snake body)
                let newFoodPosition;
                let foodOnSnake;
                do {
                    foodOnSnake = false;
                    newFoodPosition = {
                        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
                        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize
                    };
                    
                    // Check if food is on snake
                    for (let segment of snake) {
                        if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                            foodOnSnake = true;
                            break;
                        }
                    }
                } while (foodOnSnake);
                
                foodX = newFoodPosition.x;
                foodY = newFoodPosition.y;
                
                // Increase score
                score++;
                document.getElementById("score-container").innerHTML = "Score: " + score;
                
                // Increase speed every 5 points (more gradual increase)
                if (score > 0 && score % 5 === 0) {
                    increaseSpeed();
                }
            }
            
            // Check for collision with edges
            if (
                snakeX < 0 ||
                snakeX >= canvas.width ||
                snakeY < 0 ||
                snakeY >= canvas.height
            ) {
                endGame();
                return;
            }
            
            // Check for collision with self
            for (let i = 1; i < snake.length; i++) {
                if (snakeX === snake[i].x && snakeY === snake[i].y) {
                    endGame();
                    return;
                }
            }
            
            // Add new snake segment
            snake.unshift({ x: snakeX, y: snakeY });
            
            // Remove last snake segment if snake is too long
            if (snake.length > snakeLength) {
                snake.pop();
            }
        }
        
        function increaseSpeed() {
            // Reduce the delay to make the game faster
            // Minimum speed limit to prevent it from becoming unplayable
            const minSpeed = 60;
            const speedReduction = 8; // Reduce delay by 8ms each time
            
            if (currentSpeed > minSpeed) {
                currentSpeed = Math.max(minSpeed, currentSpeed - speedReduction);
            }
        }
        
        function endGame() {
            gameRunning = false;
            state = "Game Over! Your score is " + score;
            document.getElementById("state").innerHTML = state;
            document.getElementById("state").style.display = "block";
            document.getElementById("replay").style.display = "block";
        }
        
        // Handle keyboard input
        document.addEventListener("keydown", function (event) {
            // Prevent default behavior for arrow keys and WASD
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)) {
                event.preventDefault();
            }
            
            // Update next direction based on key pressed
            switch (event.key.toLowerCase()) {
                case "w":
                case "arrowup":
                    if (snakeDirection !== "down") {
                        nextDirection = "up";
                        highlightKey('w');
                    }
                    break;
                case "s":
                case "arrowdown":
                    if (snakeDirection !== "up") {
                        nextDirection = "down";
                        highlightKey('s');
                    }
                    break;
                case "a":
                case "arrowleft":
                    if (snakeDirection !== "right") {
                        nextDirection = "left";
                        highlightKey('a');
                    }
                    break;
                case "d":
                case "arrowright":
                    if (snakeDirection !== "left") {
                        nextDirection = "right";
                        highlightKey('d');
                    }
                    break;
            }
        });
        
        // Highlight pressed key
        function highlightKey(key) {
            const keyElement = document.getElementById(`key-${key}`);
            if (keyElement) {
                keyElement.classList.add('active');
                setTimeout(() => {
                    keyElement.classList.remove('active');
                }, 150);
            }
        }
        
        // Mobile controls
        document.querySelector('.up-btn').addEventListener('click', () => {
            if (snakeDirection !== "down") nextDirection = "up";
        });
        
        document.querySelector('.down-btn').addEventListener('click', () => {
            if (snakeDirection !== "up") nextDirection = "down";
        });
        
        document.querySelector('.left-btn').addEventListener('click', () => {
            if (snakeDirection !== "right") nextDirection = "left";
        });
        
        document.querySelector('.right-btn').addEventListener('click', () => {
            if (snakeDirection !== "left") nextDirection = "right";
        });
        
        // Replay button
        document.getElementById("replay").addEventListener("click", function () {
            // Reset game state
            snakeLength = 5;
            score = 0;
            gameRunning = true;
            state = "";
            currentSpeed = baseSpeed;
            document.getElementById("score-container").innerHTML = "Score: " + score;
            document.getElementById("state").style.display = "none";
            document.getElementById("replay").style.display = "none";
            
            // Reinitialize snake and food
            initSnake();
            initFood();
            
            // Restart game loop
            if (gameLoopId) {
                cancelAnimationFrame(gameLoopId);
            }
            lastUpdateTime = performance.now();
            gameLoop();
        });
        
        // Game loop using requestAnimationFrame with speed control
        function gameLoop(timestamp) {
            if (!gameRunning) return;
            
            // Control game speed by checking time elapsed
            if (timestamp - lastUpdateTime >= currentSpeed) {
                update();
                draw();
                lastUpdateTime = timestamp;
            }
            
            gameLoopId = requestAnimationFrame(gameLoop);
        }
        
        // Initialize and start the game
        window.addEventListener('load', () => {
            resizeCanvas();
            initSnake();
            initFood();
            lastUpdateTime = performance.now();
            gameLoop();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            // Reinitialize positions if canvas size changed
            if (snake.length > 0) {
                initSnake();
                initFood();
            }
        });
        
        // Prevent scrolling on mobile when touching the game
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.game-area') || e.target.closest('.mobile-controls')) {
                e.preventDefault();
            }
        }, { passive: false });