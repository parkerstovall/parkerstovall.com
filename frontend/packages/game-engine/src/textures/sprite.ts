import type { GameObject } from '../game-object'
import type { Transform } from '../types'
import { getRGB, Texture, type Color } from './textures'

export abstract class Sprite extends Texture {
  protected color: Color

  constructor(gameObject: GameObject, color: Color) {
    super(gameObject)
    this.color = color
  }

  paintRay(
    ctx: CanvasRenderingContext2D,
    shade: number,
    transform: Transform,
  ): void {
    ctx.fillStyle = getRGB(this.color, shade)
    ctx.fillRect(transform.x, transform.y, transform.width, transform.height)
  }
}
