import { Sprite } from './sprite'
import { getRGBA } from './textures'

export class RectangleSprite extends Sprite {
  paint2d(
    ctx: CanvasRenderingContext2D,
    offsetX: number = 0,
    offsetY: number = 0,
  ): void {
    const { x, y, width, height, rotation } = this.gameObject.transform
    const drawX = x - offsetX
    const drawY = y - offsetY

    if (rotation) {
      ctx.save()
      const centerX = drawX + width / 2
      const centerY = drawY + height / 2
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      ctx.translate(-centerX, -centerY)
    }

    ctx.fillStyle = getRGBA(this.color)
    ctx.fillRect(drawX, drawY, width, height)

    if (rotation) {
      ctx.restore()
    }
  }
}
