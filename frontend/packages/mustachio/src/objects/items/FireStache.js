import { BLOCK_SIZE, ITEM_SIZE, ITEM_SPEED, ITEM_RISE_DURATION, } from '../../constants';
import { Item } from './Item';
export class FireStache extends Item {
    pointValue = 1000;
    constructor(scene, x, y) {
        super(scene, x, y, 'fire-stache', ITEM_SIZE);
        this.setImmovable(false);
        this.body.setAllowGravity(false);
        this.scene.tweens.add({
            targets: this,
            y: this.y - BLOCK_SIZE / 2 - ITEM_SIZE / 2,
            duration: ITEM_RISE_DURATION,
            onComplete: () => {
                this.scene.items.add(this);
                this.setVelocityX(ITEM_SPEED);
            },
        });
    }
    collect() {
        this.scene.addScore(this.pointValue);
        this.scene.player.changeFire(true);
        this.destroy();
    }
}
