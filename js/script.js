const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rulesEl = document.getElementById('rules');
const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext('2d');

let score = 0

const brickRowCount = 9;
const brickColumnCount = 5;

//Bricks Props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
  };

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo };
    }
  }

// Ball props
const ball = {
    x: canvasEl.width / 2,
    y: canvasEl.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
}

// Paddle props
const paddle = {
    x: canvasEl.width / 2 - 40,
    y: canvasEl.height - 20,
    w: 80,
    h: 10,
    speed: 4,
    dx: 0,
}


function drawBricks() {
    bricks.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
      });
    });
  }

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvasEl.width - 100, 30);
}

function movePaddle(){
    paddle.x += paddle.dx;

    if(paddle.x + paddle.w > canvasEl.width){
        paddle.x = canvasEl.width - paddle.w;
    }

    if(paddle.x < 0){
        paddle.x = 0
    }
}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision X axis  
    if(ball.x + ball.size > canvasEl.width || ball.x - ball.size < 0){
        ball.dx *= -1;
    }

    // Wall collision Y axis  
    if(ball.y + ball.size > canvasEl.height || ball.y - ball.size < 0){
        ball.dy *= -1;
    }

    // Paddel collision
    if(
        ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ){
        ball.dy = -ball.speed;
        
    }

    //Bricks collision
    bricks.forEach(column => {
        column.forEach(brick=>{
            if(brick.visible){
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ){
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });

    if(ball.y + ball.size > canvasEl.height ){
        showAllBricks();
        score = 0;
    }
}

function increaseScore(){
    score++;
    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBricks();
    }
}

function showAllBricks() {
    bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true));
    });
  }

function init() {
    ctx.clearRect(0,0, canvasEl.width, canvasEl.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();  
}

function update() {
    moveBall();
    movePaddle();
    init();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = 0;
    }
}


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
rulesBtn.addEventListener('click', ()=>{
    rulesEl.classList.add('show');
});

closeBtn.addEventListener('click', ()=>{
    rulesEl.classList.remove('show');
});

update();