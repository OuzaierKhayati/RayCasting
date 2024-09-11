/******CONSTANTS*******/
const canvas = getCanvas();
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const state = {x:NaN, y:NaN, radius:3000},
lightLines = [], wall=[];
let mouseX, mouseY,x,y,x1,y1,radian,intersection;

function getCanvas() {
    // Select the game canvas
    const canvas = document.querySelector("#game-canvas");
    return canvas;
}

function setCanvasSize() {
    const parent = canvas.parentNode;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
}

function getCanvasSize() {
    return {
        width: canvas.width,
        height: canvas.height
    }
}

function clearScreen() {
    const { width, height } = getCanvasSize();
    ctx.clearRect(0, 0, width, height);
}

function drawCircle(x, y, radius, fill) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI *2);
    ctx.fillStyle = fill;
    ctx.fill();
}
function drawLine(startX, startY, currentX, currentY, color){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1; //Increasing/decreasing Brightness
    ctx.stroke();
    ctx.closePath();
}

function isPointOnLine(x1,y1,x2,y2,intersectX,intersectY){
    return (Math.min(x1,x2)<=intersectX && Math.max(x1,x2)>=intersectX && 
            Math.min(y1,y2)<=intersectY && Math.max(y1,y2)>=intersectY )
}

function getIntersection(x2,y2,x3,y3,x4,y4){
    const x1=state.x;
    const y1=state.y;
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0) {
        return false;
    }
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    let seg1 = ua >= 0 && ua <= 1;
    let seg2 = ub >= 0 && ub <= 1;
    if(seg1 && seg2)
        return {x:x1 + ua * (x2 - x1), y:y1 + ua * (y2 - y1)};
    else 
        return false;
    /*const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    const intersectX = ((x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4)) / (denominator);
    const intersectY = ((x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4)) / (denominator);

    if (isPointOnLine(x1,y1,x2,y2,intersectX,intersectY) && isPointOnLine(x3,y3,x4,y4,intersectX,intersectY)){
        return {x:intersectX, y:intersectY};
    }
    return false;
    //if we gonna use this method we have to add a little number like 0.01 for example to the var angle
    when we're creating the lines in forloop of the applyPhysics 
    */
}

function applyPhysics() {
    const {width,height} = getCanvasSize();
    if(state.x>width-20){
        state.x=width-20;
    }
    if(state.x<20){
        state.x=20;
    }
    if(state.y>height-20){
        state.y=height-20;
    }
    if(state.y<20){
        state.y=20;
    }
    if(wall.length==0){newWall();}
    if(state.x){
        for (let angle=0; angle<=360; angle++){
            radian=(angle)*Math.PI/180;// add 0.01
            x=state.radius * Math.cos(radian);
            y=state.radius * Math.sin(radian);
            if(angle<=90){
                lightLines[angle]=({x:state.x+x, y:state.y-y});
            }else if(angle<=180){
                lightLines[angle]=({x:state.x+x, y:state.y-y});
            }else if(angle<=270){
                lightLines[angle]=({x:state.x+x, y:state.y-y});
            }else{
                lightLines[angle]=({x:state.x+x, y:state.y-y});
            }
        }
        for(let angle=0; angle<361; angle++){
            for (let j=0; j<wall.length; j++){
                intersection = getIntersection(lightLines[angle].x, lightLines[angle].y,wall[j].x1, wall[j].y1, wall[j].x2, wall[j].y2);
                if(intersection){
                    lightLines[angle].x = intersection.x; lightLines[angle].y = intersection.y;
                }
            }
        }
    }
}

function renderGame() {
    // Clear screen
    clearScreen();

    // Draw game
    drawCircle(state.x, state.y, state.radius, 'black');
    for (let i=0; i<lightLines.length; i++){
        drawLine(state.x, state.y, lightLines[i].x, lightLines[i].y,'white')
    }
    for(let i=0; i<wall.length; i++){
        drawLine(wall[i].x1, wall[i].y1, wall[i].x2, wall[i].y2,'white')
    }
}

function newWall(){
    const{width,height}=getCanvasSize();
    for(let i=0; i<5; i++){
        x=Math.floor(Math.random()*width);
        y=Math.floor(Math.random()*height);
        x1=Math.floor(Math.random()*width);
        y1=Math.floor(Math.random()*height);
        wall[i]={x1:x,y1:y,x2:x1,y2:y1};
    }

}

function gameLoop() {
    // Main game
    applyPhysics();
    renderGame();

    // End calls
    window.requestAnimationFrame(gameLoop);
}

function main() {
    // Set canvas width & height automatically
    setCanvasSize();
    window.addEventListener('resize', () => {
        setCanvasSize();
    })
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        state.x = mouseX; state.y=mouseY;
    })

    document.addEventListener('keyup', (e) => {
        if(e.key==="r" || e.key==="R"){
            newWall();
        }
    })
    // Run game
    window.requestAnimationFrame(gameLoop)
}

/****Main call*****/
main();
