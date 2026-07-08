import { frameNumber } from '../engine'
import type { GameObject } from '../game-object'
import type { Transform } from '../types'
import { Texture } from './textures'

export class ImageSprite extends Texture {
  private image = new Image()
  private lastDrawFrame: number = -1

  constructor(gameObject: GameObject, imgSrc: string) {
    super(gameObject)
    this.image.src = imgSrc
  }

  setImage(imgSrc: string) {
    this.image.src = imgSrc
  }

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

    ctx.drawImage(this.image, drawX, drawY, width, height)

    if (rotation) {
      ctx.restore()
    }
  }

  paintRay(
    ctx: CanvasRenderingContext2D,
    _shade: number,
    transform: Transform,
  ): void {
    if (frameNumber === this.lastDrawFrame) {
      return
    }

    this.lastDrawFrame = frameNumber
    ctx.drawImage(
      this.image,
      transform.x,
      transform.y,
      this.gameObject.transform.width,
      transform.height,
    )
  }
}
