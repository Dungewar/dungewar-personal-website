for(let i = 0; i < 10; i++) {
    console.log(i);
}
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if(!ctx) throw new Error("Can't find canvas context");

ctx.fillRect(20, 20, 100, 200);
ctx.fillStyle = '#9e9e9e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
console.log(canvas);

canvas.addEventListener('click', () => {
    console.log("Clicked!");
});

