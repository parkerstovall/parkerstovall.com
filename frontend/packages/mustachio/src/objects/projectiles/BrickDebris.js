import Phaser from 'phaser';
import { GAME_HEIGHT, PROJECTILE_SIZE } from '../../constants';
export class BrickDebris extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, velocityX, velocityY) {
        super(scene, x, y, 'brick-debris');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setDisplaySize(PROJECTILE_SIZE, PROJECTILE_SIZE);
        this.body.setAllowGravity(true);
        this.setVelocity(velocityX, velocityY);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > GAME_HEIGHT) {
            this.destroy();
        }
    }
}
