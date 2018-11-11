let canvas;
let ctx;
let game;
let fps = 60;
let startBtn = document.querySelector('#startBtn');
let retry = document.querySelector('#retry');
let back = document.querySelector('#backToMenu');
let starship = new Image(100,100);
starship.src = "starship.png";
const SHIP_WIDTH = 100;
const SHIP_HEIGHT = 75;
let shipX = 50;
let shipY = 525;
let bulletX;
let bulletY = 495;
let bulletW = 10;
let bulletH = 10;
let enemyX = Math.floor(Math.random()*320);
let enemyY = Math.floor(Math.random()*100);
let enemyW = Math.floor(Math.random()*200)+20;
let enemyH = Math.floor(Math.random()*100)+20;
let bossW = 100;
let bossH = 100;
let bossX = Math.floor(Math.random()*400);
let bossY = Math.floor(Math.random());
let bossSpeedX = 5;
let bossSpeedY = 5;
let boss = new Image(bossW, bossH);
boss.src = "boss.jpg";
let enemyHp = 5;
let enemyCount = 30;
let bossHp = 200;
let enemyR = Math.floor(Math.random()*50);
let randomNum = Math.floor(Math.random()*200);
let colors = ['yellow', 'red', 'aqua', 'teal', 'olive', 'navy', 'purple', 'lime', 'silver', 'fuchsia'];
let colorRand;
let colorsPick;

let mouseX = 0;
let mouseY = 0;

let blast = new Audio();
blast.src = "blast.mp3";

back.style.display = "none";
startBtn.addEventListener('click', startGame);
retry.addEventListener('click', retryGame);
back.addEventListener('click', backToMainMenu);
    
function startGame () {
    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d'); 
    canvas.style.display = "block";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    startBtn.style.display = "none";
    back.style.display = "none";
    retry.style.display = "none";
    countDown(3, 1000);
    countDown(2, 2000);
    countDown(1, 3000);
    setTimeout(() => {
    game = setInterval(gameplay, 1000/fps);
    }, 4000);
    canvas.addEventListener('mousemove', updateMousePos);

}
 

let gameplay = () => {
    draw();
    shooting();
    stop();
}

let updateMousePos = (evt) =>{
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
    shipX = mouseX - SHIP_WIDTH/2;
    bulletX = (shipX+SHIP_WIDTH/2)-5;    
 }

let shooting = () => { 
    bulletY -= 40;
    if (bulletY <= 0) {
        bulletY = 510;
    }
     collision();
}

let collision = () => {
    enemyY += 10;
    if(enemyY >= canvas.height){
        enemyY = 0;
        random();
        enemy(enemyX, enemyY, enemyW, enemyH, colorsPick);
    }
    if(bulletX < enemyX + enemyW && bulletX + bulletW > enemyX && bulletY < enemyY + enemyH && bulletY + bulletH > enemyY){
        enemyHp--;
        blast.play();
        bulletY = 510;
        if (enemyHp == 0) {
            enemyCount--;
            random();
            enemy(enemyX, enemyY, enemyW, enemyH, colorsPick);
            enemyHp = 5;
        }
    }

    if (bulletX < bossX + bossW && bulletX + bulletW > bossX && bulletY < bossY + bossH && bulletY + bulletH > bossY) {
        bossHp--;
        blast.play();
        bulletY = 510;
        if (bossHp == 0) {
            clearBoss();
        }
    }
      
}


let draw = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(starship,shipX,shipY,SHIP_WIDTH,SHIP_HEIGHT);
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bulletX, bulletY,bulletW, bulletH);
    ctx.fillStyle = "red";
    ctx.font="20px Verdana";
    ctx.fillText(`Enemy: ${enemyCount}`, 0, 20);
    if (enemyCount > 0) {
        enemy(enemyX, enemyY, enemyW, enemyH, colorsPick);
    }else{
        ctx.fillStyle = "red";
        ctx.font="20px Verdana";
        ctx.fillText(`Lord Star LIPS: ${bossHp}`, 290, 20);
        clearEnemy();
        bossMove();
    }
    
}


let enemy = (x, y, w, h, color) => {
    ctx.fillStyle = colorsPick;
    ctx.fillRect(x, y, w, h);
}

let clearEnemy = () => {
        enemyY = 0;
        enemyX = 0;
        enemyH = 0;
        enemyW = 0;
}

let clearBoss = () => {
        bossY = 0;
        bossX = 0;
        bossH = 0;
        bossW = 0;
}

let random = () => {
        enemyX = Math.floor(Math.random()*300);
        enemyY = Math.floor(Math.random()*100);
        enemyW = Math.floor(Math.random()*200)+20;
        enemyH = Math.floor(Math.random()*100)+20;
        enemyR = Math.floor(Math.random()*50);
        colorRand = Math.floor(Math.random()*9);
        colorsPick = colors[colorRand];
}

let stop = () => {
      if ((shipX < enemyX + enemyW && shipX + SHIP_WIDTH > enemyX && shipY < enemyY + enemyH && shipY + SHIP_HEIGHT > enemyY) ||
        (shipX < bossX + bossW && shipX + SHIP_WIDTH > bossX && shipY < bossY + bossH && shipY + SHIP_HEIGHT > bossY)) {
            endGame();
    }
    if (bossHp === 0) {
        victory();
    }
    
}

let bossMove = () => {
    ctx.drawImage(boss,bossX,bossY,bossW,bossH);
    bossX += bossSpeedX;
    bossY += bossSpeedY;
    if (bossX+bossW > canvas.width) {
        bossSpeedX = -bossSpeedX;
    }
    if (bossY+bossW > canvas.height) {
        bossY = 0;
    }
    if (bossX < 0) {
        bossSpeedX = -bossSpeedX;
    }
}
let endGame = () => {
        clearInterval(game);
        ctx.fillStyle = "red";
        ctx.font="30px Verdana";
        ctx.fillText("GAME OVER", canvas.width/2-100, canvas.height/2);
        retry.style.display = "block";
        enemyCount = 30;
        bossHp = 200;
}
let victory = () => {
        clearBoss();
        ctx.fillStyle = "green";
        ctx.font="30px Verdana";
        ctx.fillText("SPASIO SI SRBIJU", canvas.width/2-100, canvas.height/2);
        setTimeout(() => {
           clearInterval(game); 
        }, 3000);
        back.style.display = "block";     
}

let countDown = (count, miliseconds) => {
  setTimeout(() => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font="50px Verdana";
        ctx.fillText(`${count}`, canvas.width/2-25, canvas.height/2);
  }, miliseconds);
};

function retryGame () {
    clearEnemy();
    clearBoss();
    startGame();
}

function backToMainMenu () {
    back.style.display = "none";
    startBtn.style.display = "block";
    canvas.style.display = "none";  
    enemyCount = 30;
    bossHp = 200; 
}
