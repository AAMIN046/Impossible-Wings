const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

/* ---------------- IMAGES ---------------- */

const bgImg = new Image();
bgImg.src = "https://i.imgur.com/3e5p6kP.png"; // background

const birdFrames = [];
for (let i = 0; i < 3; i++) {
  let img = new Image();
  img.src = `https://i.imgur.com/QZ6XG5Q.png`; // same sprite (replace with 3 frame sprite if you want)
  birdFrames.push(img);
}

/* ---------------- SOUNDS ---------------- */

const flapSound = new Audio("https://www.soundjay.com/button/sounds/button-16.mp3");
const hitSound = new Audio("https://www.soundjay.com/button/sounds/button-10.mp3");

/* ---------------- GAME VARIABLES ---------------- */

let bird = {
  x: 60,
  y: 200,
  width: 40,
  height: 30,
  gravity: 0.25,
  lift: -8,
  velocity: 0,
  frame: 0
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 170;
let frameCount = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;
let speed = 2.5;
let gameOver = false;

/* ---------------- CONTROLS ---------------- */

function jump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
    flapSound.play();
  }
}

document.addEventListener("click", jump);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

/* ---------------- DRAW ---------------- */

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
  ctx.drawImage(
    birdFrames[bird.frame],
    bird.x,
    bird.y,
    bird.width,
    bird.height
  );
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
  });
}

function drawText() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
  ctx.fillText("High: " + highScore, 10, 50);
  ctx.fillText("Level: " + level, 10, 75);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 90, 300);
  }
}

/* ---------------- UPDATE ---------------- */

function update() {
  if (gameOver) return;

  frameCount++;

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Bird flap animation
  if (frameCount % 10 === 0) {
    bird.frame = (bird.frame + 1) % birdFrames.length;
  }

  // Create pipes
  if (frameCount % 100 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + pipeGap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= speed;

    // Collision
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
      hitSound.play();
    }

    // Score
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;

      // Level up every 5 points
      if (score % 5 === 0) {
        level++;
        speed += 0.5;
        pipeGap -= 5;
      }
    }
  });

  // Ground collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
    hitSound.play();
  }

  // High score save
  if (gameOver && score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

/* ---------------- GAME LOOP ---------------- */

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  update();
  drawBird();
  drawPipes();
  drawText();

  requestAnimationFrame(gameLoop);
}

bgImg.onload = function () {
  gameLoop();
};

/* ---------------- RESTART ---------------- */

document.getElementById("restartBtn").addEventListener("click", () => {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  level = 1;
  speed = 2.5;
  pipeGap = 170;
  frameCount = 0;
  gameOver = false;
});
