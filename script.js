const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let frame = 0;
let score = 0;
let gameOver = false;

// Bird Jump
document.addEventListener("click", () => {
  bird.velocity = bird.lift;
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
  });
}

function update() {
  if (gameOver) return;

  frame++;

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Create pipes
  if (frame % 90 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 100) + 20;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + pipeGap
    });
  }

  // Move pipes
  pipes.forEach(pipe => {
    pipe.x -= 3;

    // Collision
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score
    if (pipe.x === bird.x) {
      score++;
    }
  });

  // Ground collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawGameOver() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 100, 300);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  drawBird();
  drawPipes();
  drawScore();
  drawGameOver();

  requestAnimationFrame(gameLoop);
}

gameLoop();

// Restart
document.getElementById("restartBtn").addEventListener("click", () => {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
});
