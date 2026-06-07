import Phaser from 'phaser';
export class Wall extends Phaser.GameObjects.TileSprite {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height, 'wall-tile');
        this.setOrigin(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        scene.platforms.add(this);
    }
}
