export class Wall extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x * 32, y * 32, 'wall')

    // Add to scene and to the walls group
    this.setOrigin(0, 0) // Top-left origin
    scene.add.existing(this)
  }

  static addWallGraphics(scene: Phaser.Scene) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0x333333, 1) // dark gray wall
    graphics.fillRect(0, 0, 32, 32) // 32x32 square
    graphics.generateTexture('wall', 32, 32)
    graphics.destroy()
  }
}
