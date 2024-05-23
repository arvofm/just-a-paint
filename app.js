/* ----- Variables ----- */
const canvas = document.querySelector('canvas#one');
const ctx = canvas.getContext('2d');

const colorPicker = document.querySelector('input[type="color"]');
const colorOutput = document.querySelector('span#pen-color-output');
const shapePicker = document.querySelector('select#pen-shape-input');
const shapeOutput = document.querySelector('span#pen-shape-output');
const sizePicker = document.querySelector('input[type="range"]');
const sizeOutput = document.querySelector('span#pen-size-output');
const clearBtn = document.querySelector('button#clear-button');

const firstColor = 'rgb(255, 255, 255)';
let penSize;
let drawing;
let cursorX;
let cursorY;
let pastCoordinates;
let pastCoordinatesIndex; // min:0 max:7
let shapeAndStyle;
let isFill;         // whether to fill or stroke
let isLine;         // whether to draw line or not
let isArc;          // whether to draw arc or not
let isSquare;       // whether to draw square or not
let isTriangle;     // whether to draw triangle or not



/* ----- Functions ----- */
function init() {
    drawing = false;
    pastCoordinates = new Uint16Array(new ArrayBuffer(32));
    pastCoordinatesIndex = 0;
    shapeAndStyle = [];
    isFill = true;
    isLine = true;
    isArc = false;
    isSquare = false;
    isTriangle = false;
    canvas.width = window.innerWidth*(0.8);
    canvas.height = window.innerHeight;
    ctx.lineCap = 'round';
    clearCanvas();
    colorPicker.value = ctx.fillStyle = ctx.strokeStyle = firstColor;
    penSize = Number(sizePicker.value);
    ctx.lineWidth = 1;
}

function clearCanvas() {
    const originalColor = ctx.fillStyle ? ctx.fillStyle : firstColor;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.strokeStyle = originalColor;
}

function draw() {
    if (drawing) {
        ctx.beginPath();
        if (isLine) {
            if (pastCoordinatesIndex && pastCoordinates[2*pastCoordinatesIndex]) {
                ctx.moveTo(pastCoordinates[2*pastCoordinatesIndex-2], pastCoordinates[2*pastCoordinatesIndex-1]);
                ctx.lineTo(pastCoordinates[2*pastCoordinatesIndex], pastCoordinates[2*pastCoordinatesIndex+1]);
                ctx.lineTo(cursorX, cursorY);
                ctx.fill();
            }
        }
        else {
            if (isArc) {
                ctx.moveTo(cursorX + penSize/2, cursorY);
                ctx.arc(cursorX, cursorY, penSize/2, 0, 2*Math.PI); }
            else if (isSquare) {
                ctx.rect(cursorX - penSize/2, cursorY - penSize/2, penSize, penSize); }
            else if (isTriangle) {
                ctx.moveTo(cursorX - (2*penSize)/3, cursorY);
                ctx.lineTo(cursorX, cursorY - penSize);
                ctx.lineTo(cursorX + (2*penSize)/3, cursorY);
                ctx.closePath();
            }
            if (isFill) ctx.fill();
            else ctx.stroke();
        }
    }
    requestAnimationFrame(draw)
}

function fetchCoordinates(event) {
    pastCoordinates.set([cursorX, cursorY], 2*pastCoordinatesIndex);
    pastCoordinatesIndex += pastCoordinatesIndex < 7 ? 1 : -pastCoordinatesIndex;
    cursorX = event.clientX - canvas.getBoundingClientRect().left;
    cursorY = event.clientY - canvas.getBoundingClientRect().top;
}


/* ----- Events ----- */
canvas.addEventListener('pointermove', fetchCoordinates);

canvas.onmousedown = () =>  {
    drawing = true;
    pastCoordinatesIndex = 0;
    pastCoordinates.fill(0);
};
canvas.onmouseup = () => drawing = false;

colorPicker.oninput = e => colorOutput.textContent = ctx.strokeStyle = ctx.fillStyle = e.target.value;

shapePicker.oninput = e =>  {
    shapeAndStyle = (shapeOutput.textContent = e.target.value).split('-', 2).map(s => s.trim());
    isFill = shapeAndStyle[0] == 'fill' ? true : false;
    isLine = shapeOutput.textContent.trim() == 'line' ? true : false;
    isArc = shapeAndStyle[1] == 'circle' ? true : false;
    isSquare = shapeAndStyle[1] == 'square' ? true : false;
    isTriangle = shapeAndStyle[1] == 'triangle' ? true : false;

}

sizePicker.oninput = e => sizeOutput.textContent = penSize = e.target.value;

clearBtn.onclick = () => clearCanvas();


/* Run */
window.onload = () =>  {
    init();
    draw();
}
