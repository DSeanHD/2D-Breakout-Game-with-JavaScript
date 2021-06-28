var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

// Variables and loop used to initialize th bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// EventListeners used to detect key and mouse movement in order to move the paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Functions used to move the paddle with keys or mouse movement
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Function used to create collision detection for when the ball hits a brick
// It also increments the score and makes the brick disappear when the ball hits the brick
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN!!!! CONGRATULATIONS!!! Your Score is: " + score);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Function used to create the score on the canvas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// Function used to show the amount of live a player has left
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Function used to create the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Function used to create the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Function used to create the array of bricks
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = ( c * (brickWidth + brickPadding) ) + brickOffsetLeft;
                var brickY = ( r * (brickHeight + brickPadding) ) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// This is the main function of the program
// It displays all of the previous functions used in the code
function draw() {
    // Along with requestAnimationFrame, 'clearRect' makes the ball move across the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    // The two if statements will make the ball go in the opposite direction when it hits
    // one of the sides of the canvas except the bottom side
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    // This else if statement controls the bottom part of the canvas
    else if (y + dy > canvas.height - ballRadius) {
        // This if statement detects what happens when the ball hits the paddle
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        // This else statement will control what happens when the ball hits the bottom but not
        // on the paddle
        else {
            lives--;

            if (!lives) {
                alert("Game Over! You lost with a score of: " + score);
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // This two if statements will make the paddle move when the right or left
    // keys are pressed
    if (rightPressed) {
        paddleX += 4;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 4;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}


draw();