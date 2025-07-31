type Tile = {
    flag: boolean;
    revealed: boolean;
    bomb: boolean;
}

function dig(board: Tile[][], x: number, y: number): boolean {
    board[x][y].revealed = true;
    return board[x][y].bomb;
}

/**
 * Represents a rectangular region inside a larger image (tilemap).
 */
interface Sprite {
    source: HTMLImageElement; // Full tilemap image
    sx: number; // Source X (within tilemap)
    sy: number; // Source Y
}

const tilemap: HTMLImageElement = new Image();
tilemap.src = './tilemap.png';
const tilemapTileSize = 16;

let displayedTileSize = 32;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error("Can't find canvas context");

ctx.imageSmoothingEnabled = false;

// Background
ctx.fillStyle = '#9e9e9e';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('click', () => {
    console.log("Clicked!");
});


let board: Tile[][];

// Important - wait for assets to load
tilemap.onload = () => {

    function drawSprite(sprite: Sprite, x: number, y: number, xOffset: number = 0, yOffset: number = 0) {
        ctx?.drawImage(
            sprite.source,
            sprite.sx * tilemapTileSize, sprite.sy * tilemapTileSize, tilemapTileSize, tilemapTileSize, // source rect
            x * displayedTileSize + xOffset, y * displayedTileSize + yOffset, displayedTileSize, displayedTileSize                  // destination rect
        );
    }

    const oneSprite: Sprite = {
        source: tilemap,
        sx: 0,
        sy: 0,
    }
    const twoSprite: Sprite = {
        source: tilemap,
        sx: 1,
        sy: 0,
    }
    const threeSprite: Sprite = {
        source: tilemap,
        sx: 2,
        sy: 0,
    }
    const fourSprite: Sprite = {
        source: tilemap,
        sx: 3,
        sy: 0,
    }
    const fiveSprite: Sprite = {
        source: tilemap,
        sx: 0,
        sy: 1,
    }
    const sixSprite: Sprite = {
        source: tilemap,
        sx: 1,
        sy: 1,
    }
    const sevenSprite: Sprite = {
        source: tilemap,
        sx: 2,
        sy: 1,
    }
    const eightSprite: Sprite = {
        source: tilemap,
        sx: 3,
        sy: 1,
    }
    const zeroSprite: Sprite = {
        source: tilemap,
        sx: 0,
        sy: 2,
    }
    const unrevealedSprite: Sprite = {
        source: tilemap,
        sx: 1,
        sy: 2,
    }
    const bombSprite: Sprite = {
        source: tilemap,
        sx: 2,
        sy: 2,
    }
    const flagSprite: Sprite = {
        source: tilemap,
        sx: 3,
        sy: 2,
    }

    const numberSprites: Record<number, Sprite> = {};

    numberSprites[0] = zeroSprite;
    numberSprites[1] = oneSprite;
    numberSprites[2] = twoSprite;
    numberSprites[3] = threeSprite;
    numberSprites[4] = fourSprite;
    numberSprites[5] = fiveSprite;
    numberSprites[6] = sixSprite;
    numberSprites[7] = sevenSprite;
    numberSprites[8] = eightSprite;
    // TODO: Remove original definitions for these

    drawSprite(numberSprites[0], 1, 1);


}