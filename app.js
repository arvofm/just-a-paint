/* Variables */
const canvas = document.querySelector('canvas#one');
const ctx = canvas.getContext('2d');

const colorPicker = document.querySelector('input[type="color"]');
const colorOutput = document.querySelector('span#pen-color-output');
const sizePicker = document.querySelector('input[type="range"]');
const sizeOutput = document.querySelector('span#pen-size-output');

const clearBtn = document.querySelector('button#clear-button');

const firstColor = 'rgb(255, 255, 255)';
const firstSize = 3;

let drawing = false;
let cursorX;
let cursorY;
let pastCoordinates = new Uint16Array(new ArrayBuffer(32));
let pastCoordinatesIndex; // min:0 max:7


/* Functions */
function init() {
    canvas.width = window.innerWidth*(0.8);
    canvas.height = window.innerHeight;
    clearCanvas();
    colorPicker.value = ctx.fillStyle = firstColor;
    sizePicker.value = ctx.lineWidth = firstSize;
}

function clearCanvas() {
    const originalColor = ctx.fillStyle ? ctx.fillStyle : firstColor;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = originalColor;
}

function draw() {
    if (drawing) {
        ctx.beginPath();
        if (pastCoordinatesIndex && pastCoordinates[2*pastCoordinatesIndex])
            ctx.moveTo(pastCoordinates[2*pastCoordinatesIndex-2], pastCoordinates[2*pastCoordinatesIndex-1]);
            ctx.lineTo(pastCoordinates[2*pastCoordinatesIndex], pastCoordinates[2*pastCoordinatesIndex+1]);
        ctx.lineTo(cursorX, cursorY);
        ctx.fill();
    }
    requestAnimationFrame(draw)
}

function fetchCoordinates(event) {
    pastCoordinates.set([cursorX, cursorY], 2*pastCoordinatesIndex);
    pastCoordinatesIndex += pastCoordinatesIndex < 7 ? 1 : -pastCoordinatesIndex;
    cursorX = event.clientX - canvas.getBoundingClientRect().left;
    cursorY = event.clientY - canvas.getBoundingClientRect().top;
}


/* Events */
canvas.addEventListener('pointermove', fetchCoordinates);

canvas.onmousedown = () =>  {
    drawing = true;
    pastCoordinatesIndex = 0;
    pastCoordinates.fill(0);
};
canvas.onmouseup = () => drawing = false;

colorPicker.oninput = e => {
    colorOutput.textContent = ctx.strokeStyle = ctx.fillStyle = e.target.value;
};

sizePicker.oninput = e => {
    ctx.lineWidth = e.target.value;
    sizeOutput.textContent = e.target.value;
};

clearBtn.onclick = () => clearCanvas();


/* Run */
init();
draw();
