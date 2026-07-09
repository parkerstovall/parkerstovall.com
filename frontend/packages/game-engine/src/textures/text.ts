import type { GameObject } from '../game-object'
import { getRGBA, Texture, type Color } from '../rendering'

export class Text extends Texture {
  private text: string
  private color: Color
  private readonly alignment: 'center' | 'left' | 'right'
  private readonly font: string

  constructor(
    gameObject: GameObject,
    text: string,
    color: Color,
    alignment: 'center' | 'left' | 'right' = 'left',
    font: string = '24px serif',
  ) {
    super(gameObject)
    this.text = text
    this.color = color
    this.alignment = alignment
    this.font = font
  }

  setText(text: string) {
    this.text = text
  }

  setColor(color: Color) {
    this.color = color
  }

  paint2d(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.font
    ctx.textAlign = this.alignment
    ctx.textBaseline = 'top'
    ctx.fillStyle = getRGBA(this.color)
    const { x, y, width } = this.gameObject.transform
    ctx.fillText(this.text, x, y, width)
  }
}
