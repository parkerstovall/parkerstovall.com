export class Item extends Phaser.Physics.Arcade.Sprite {
    coords;
    constructor(scene, x, y, sizeOffset, texture) {
        const adjustedX = x * 32 + sizeOffset;
        const adjustedY = y * 32 + sizeOffset;
        super(scene, adjustedX, adjustedY, texture);
        this.coords = { x, y };
        // Add to scene
        this.setOrigin(0, 0); // Top-left origin
        scene.add.existing(this);
    }
}
