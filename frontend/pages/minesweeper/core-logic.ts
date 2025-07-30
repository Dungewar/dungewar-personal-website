/**
 * Represents a rectangular region inside a larger image (tilemap).
 */
export interface Sprite {
    source: HTMLImageElement; // Full tilemap image
    sx: number; // Source X (within tilemap)
    sy: number; // Source Y
}
const tilemap: HTMLImageElement = new Image();
tilemap.src = './tilemap.png';
const tilemapTileSize = 16;

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if(!ctx) throw new Error("Can't find canvas context");

ctx.fillStyle = '#9e9e9e';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('click', () => {
    console.log("Clicked!");
});

tilemap.onload = () => {
    const oneSprite: Sprite = {
        source: tilemap,
        sx: 0,
        sy: 0,
    }

    function drawSprite(sprite: Sprite, x: number, y: number) {
        ctx?.drawImage(
            sprite.source,
            sprite.sx * tilemapTileSize, sprite.sy * tilemapTileSize, tilemapTileSize, tilemapTileSize, // source rect
            x * tilemapTileSize, y * tilemapTileSize, tilemapTileSize, tilemapTileSize                  // destination rect
        );
    }


    drawSprite(oneSprite, 3, 3);
}