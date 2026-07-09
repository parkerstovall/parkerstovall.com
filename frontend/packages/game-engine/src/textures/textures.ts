import type { GameObject } from '../game-object'
import type { Transform } from '../types'

export type Color = {
  r: number
  g: number
  b: number
  a?: number
}

export const WHITE: Color = {
  r: 255,
  g: 255,
  b: 255,
} as const

export const getRGBA = (color: Color, shade?: number) => {
  if (shade === undefined) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`
  }

  const r = Math.floor(color.r * shade)
  const g = Math.floor(color.g * shade)
  const b = Math.floor(color.b * shade)
  return `rgba(${r}, ${g}, ${b}, ${color.a ?? 1})`
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
