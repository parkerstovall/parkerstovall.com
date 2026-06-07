import Phaser from 'phaser';
export class CaveWall extends Phaser.GameObjects.TileSprite {
    constructor(scene, options) {
        super(scene, options.x, options.y, options.width, options.height, 'cave-wall');
        this.setOrigin(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static body
        scene.platforms.add(this);
    }
}
