import Phaser from 'phaser';
import { ABOVE_PLAYER_DEPTH, PIPE_DEFAULT_SIZE } from '../../constants';
import { StacheSeed } from '../enemies/StacheSeed';
export class Pipe extends Phaser.GameObjects.TileSprite {
    constructor(scene, options) {
        const w = options.width ?? PIPE_DEFAULT_SIZE;
        const h = options.height ?? PIPE_DEFAULT_SIZE;
        super(scene, options.x, options.y, w, h, 'pipe');
        this.setOrigin(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        scene.platforms.add(this);
        this.setDepth(ABOVE_PLAYER_DEPTH);
        if (options.hasStacheSeed) {
            new StacheSeed(scene, this, options.reversed ?? false);
        }
    }
}
