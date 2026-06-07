import Phaser from 'phaser';
import { PLAYER_DEPTH } from '../../constants';
export class Floor extends Phaser.GameObjects.TileSprite {
    constructor(scene, options) {
        super(scene, options.x, options.y, options.width, options.height, 'floor-tile');
        this.setOrigin(0, 0);
        this.setDepth(PLAYER_DEPTH);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static body
        // Add to platforms group
        scene.platforms.add(this);
    }
}
