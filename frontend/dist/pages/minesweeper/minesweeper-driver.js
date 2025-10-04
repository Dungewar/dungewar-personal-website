"use strict";
console.log("Welcome to Minesweeper Driver");
function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < board.length && y < board[0].length;
}
function dig(x, y) {
    console.assert(inBounds(x, y));
    board[x][y].revealed = true;
    if (numNeighbors(x, y) == 0) {
        for (let col = x - 1; col <= x + 1; col++) {
            for (let row = y - 1; row <= y + 1; row++) {
                if (inBounds(col, row) && !board[col][row].revealed)
                    if (dig(col, row))
                        return true;
            }
        }
    }
    return board[x][y].bomb;
}
const tilemap = new Image();
tilemap.src = './tilemap.png';
const tilemapTileSize = 16;
let xOffset = 0;
let yOffset = 0;
let displayedTileSize = 32;
const canvas = document.getElementById('gameCanvas');
console.log("Canvas is %d %d", canvas.width, canvas.height);
let bombsSpawned = false;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
// Background
ctx.fillStyle = '#9e9e9e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
/**
 * The board is ordered [x][y] so it's [col][row], and no you can't have fish or I'll ki** you.
 */
let board;
const oneSprite = {
    source: tilemap,
    sx: 0,
    sy: 0,
};
const twoSprite = {
    source: tilemap,
    sx: 1,
    sy: 0,
};
const threeSprite = {
    source: tilemap,
    sx: 2,
    sy: 0,
};
const fourSprite = {
    source: tilemap,
    sx: 3,
    sy: 0,
};
const fiveSprite = {
    source: tilemap,
    sx: 0,
    sy: 1,
};
const sixSprite = {
    source: tilemap,
    sx: 1,
    sy: 1,
};
const sevenSprite = {
    source: tilemap,
    sx: 2,
    sy: 1,
};
const eightSprite = {
    source: tilemap,
    sx: 3,
    sy: 1,
};
const zeroSprite = {
    source: tilemap,
    sx: 0,
    sy: 2,
};
const unrevealedSprite = {
    source: tilemap,
    sx: 1,
    sy: 2,
};
const bombSprite = {
    source: tilemap,
    sx: 2,
    sy: 2,
};
const flagSprite = {
    source: tilemap,
    sx: 3,
    sy: 2,
};
const numberSprites = {};
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
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function numNeighbors(x, y) {
    console.assert(inBounds(x, y));
    if (!inBounds(x, y)) {
        console.assert("I AM GOD!");
        console.log("Fick assertions");
    }
    // let numNeighbors = board[x][y].bomb ? -1 : 0;
    let numNeighbors = 0;
    for (let col = x - 1; col <= x + 1; col++) {
        for (let row = y - 1; row <= y + 1; row++) {
            if (inBounds(col, row) && board[col][row].bomb)
                numNeighbors++;
        }
    }
    return numNeighbors;
}
// Important - wait for assets to load
function lose() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j].revealed = true;
        }
    }
}
tilemap.onload = () => {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const boardX = Math.floor((x - xOffset) / displayedTileSize);
        const boardY = Math.floor((y - yOffset) / displayedTileSize);
        console.log("Digging %d, %d which is %d, %d", x, y, boardX, boardY);
        if (inBounds(boardX, boardY)) {
            if (!bombsSpawned) {
                spawnBombs(boardX, boardY, 100);
                bombsSpawned = true;
            }
            if (dig(boardX, boardY))
                lose();
        }
        drawBoard();
    });
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // prevent browser menu
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const boardX = Math.floor((x - xOffset) / displayedTileSize);
        const boardY = Math.floor((y - yOffset) / displayedTileSize);
        if (inBounds(boardX, boardY)) {
            board[boardX][boardY].flag = !board[boardX][boardY].flag;
            console.log("Flagging %d, %d into %b", boardX, boardY, board[boardX][boardY].flag);
        }
        drawBoard();
    });
    function drawSprite(sprite, x, y) {
        // console.log("Drawing sprite")
        ctx?.drawImage(sprite.source, sprite.sx * tilemapTileSize, sprite.sy * tilemapTileSize, tilemapTileSize, tilemapTileSize, // source rect
        x * displayedTileSize + xOffset, y * displayedTileSize + yOffset, displayedTileSize, displayedTileSize // destination rect
        );
    }
    function reloadLevel(size) {
        if (size <= 0 || size > 1000)
            throw new Error("Invalid size");
        bombsSpawned = false;
        board = [];
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i][j] = {
                    flag: false,
                    bomb: false,
                    revealed: false,
                };
            }
        }
    }
    function spawnBombs(excludedX, excludedY, bombCount) {
        const size = board.length;
        if (bombCount <= 0 || bombCount >= size * size - 9)
            throw new Error("Invalid bomb count " + bombCount);
        for (let i = 0; i < bombCount;) {
            const x = randomInt(0, size);
            const y = randomInt(0, size);
            if (!board[x][y].bomb && (Math.abs(excludedX - x) > 1 || Math.abs(excludedY - y) > 1)) {
                board[x][y].bomb = true;
                i++;
            }
        }
    }
    function drawBoard() {
        // console.log("Drawing board...");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (!board[i][j].revealed) {
                    if (board[i][j].flag)
                        drawSprite(flagSprite, i, j);
                    else {
                        drawSprite(unrevealedSprite, i, j);
                    }
                    continue;
                }
                if (board[i][j].bomb) {
                    drawSprite(bombSprite, i, j);
                    continue;
                }
                drawSprite(numberSprites[numNeighbors(i, j)], i, j);
            }
        }
    }
    reloadLevel(20);
    drawBoard();
};
//# sourceMappingURL=minesweeper-driver.js.map