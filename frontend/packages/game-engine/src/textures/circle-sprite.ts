import { Sprite } from './sprite'
import { getRGB } from './textures'

export class CircleSprite extends Sprite {
  paint2d(
    ctx: CanvasRenderingContext2D,
    offsetX: number = 0,
    offsetY: number = 0,
  ): void {
    const { x, y, width, height } = this.gameObject.transform
    const drawX = x - offsetX
    const drawY = y - offsetY

    const centerX = drawX + width / 2
    const centerY = drawY + height / 2
    ctx.fillStyle = getRGB(this.color)
    ctx.beginPath()
    ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI)
    ctx.fill()
  }
}
