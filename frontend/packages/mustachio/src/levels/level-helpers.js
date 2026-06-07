import { BLOCK_SIZE } from '../constants';
import { Wall } from '../objects/blocks/Wall';
import { Brick } from '../objects/blocks/Brick';
import { Coin } from '../objects/items/Coin';
import { FallingFloor } from '../objects/blocks/FallingFloor';
export function createBlockWall(scene, startingX, startingY, numBlocksWide, numBlocksHigh, blockType) {
    // Walls use a single TileSprite with one static body to avoid
    // edge-catching issues with individual block sprites
    if (blockType === 'wall') {
        new Wall(scene, startingX * BLOCK_SIZE, startingY * BLOCK_SIZE, numBlocksWide * BLOCK_SIZE, numBlocksHigh * BLOCK_SIZE);
        return;
    }
    for (let i = 0; i < numBlocksWide; i++) {
        for (let j = 0; j < numBlocksHigh; j++) {
            const x = (startingX + i) * BLOCK_SIZE;
            const y = (startingY + j) * BLOCK_SIZE;
            if (blockType === 'brick') {
                new Brick(scene, x, y);
            }
            else if (blockType === 'coin') {
                new Coin(scene, x, y);
            }
            else if (blockType === 'falling-floor') {
                new FallingFloor(scene, x, y);
            }
        }
    }
}
export function createBlockPyramid(scene, startingX, startingY, numBlocksWide, blockType) {
    while (numBlocksWide > 0) {
        createBlockWall(scene, startingX, startingY, numBlocksWide, 1, blockType);
        startingX += 1;
        startingY -= 1;
        numBlocksWide -= 2;
    }
}
export function createBlockSquare(scene, startingX, startingY, numBlocksWide, numBlocksHigh, blockType) {
    createBlockWall(scene, startingX, startingY, numBlocksWide, 1, blockType);
    createBlockWall(scene, startingX, startingY + numBlocksHigh - 1, numBlocksWide, 1, blockType);
    createBlockWall(scene, startingX, startingY + 1, 1, numBlocksHigh - 2, blockType);
    createBlockWall(scene, startingX + numBlocksWide - 1, startingY + 1, 1, numBlocksHigh - 2, blockType);
}
