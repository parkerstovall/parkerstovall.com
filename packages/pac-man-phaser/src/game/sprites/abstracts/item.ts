export abstract class Item extends Phaser.Physics.Arcade.Sprite {
  abstract readonly points: number

  readonly coords: Phaser.Types.Math.Vector2Like

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    sizeOffset: number,
    texture: string,
  ) {
    const adjustedX = x * 32 + sizeOffset
    const adjustedY = y * 32 + sizeOffset
    super(scene, adjustedX, adjustedY, texture)
    this.coords = { x, y }

    // Add to scene
    this.setOrigin(0, 0) // Top-left origin
    scene.add.existing(this)
  }
}
