import { BELOW_PLAYER_DEPTH, BLOCK_SIZE, ITEM_SPEED } from '../../constants';
export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, size) {
        // Center item in block
        x += (BLOCK_SIZE - size) / 2;
        y += (BLOCK_SIZE - size) / 2;
        super(scene, x, y, texture);
        this.setDepth(BELOW_PLAYER_DEPTH);
        this.setOrigin(0, 0);
        this.setDisplaySize(size, size);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.body.blocked.left) {
            this.setVelocityX(ITEM_SPEED);
        }
        else if (this.body.blocked.right) {
            this.setVelocityX(-ITEM_SPEED);
        }
    }
}
