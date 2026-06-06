import { Item } from './abstracts/item'

export class Pellet extends Item {
  readonly points: number = 10

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 12, 'pellet')
  }

  static addPelletGraphics(scene: Phaser.Scene) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffffff, 1) // white pellet
    graphics.fillCircle(4, 4, 4) // 4 radius
    graphics.generateTexture('pellet', 8, 8)
    graphics.destroy()
  }
}
