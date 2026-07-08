import type { GameObject } from '../game-object'
import type { Transform } from '../types'

export type Color = {
  r: number
  g: number
  b: number
}

export const getRGB = (color: Color, shade?: number) => {
  if (shade === undefined) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  const r = Math.floor(color.r * shade)
  const g = Math.floor(color.g * shade)
  const b = Math.floor(color.b * shade)
  return `rgb(${r}, ${g}, ${b})`
}

export abstract class Texture {
  protected readonly gameObject: GameObject

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject
  }

  paint2d?(
    ctx: CanvasRenderingContext2D,
    offsetX?: number,
    offsetY?: number,
  ): void

  paintRay?(
    ctx: CanvasRenderingContext2D,
    shade: number,
    transform: Transform,
  ): void
}
