import type { Engine } from '../engine'
import { GameObject } from '../game-object'
import { RectangleSprite } from '../textures/rectangle-sprite'
import type { Color } from '../textures/textures'
import { type Transform } from '../types'

export class DevObject extends GameObject {
  public tags: string[] = []
  public zIndex: number = -1

  constructor(
    engine: Engine,
    transform: Transform,
    layer: number,
    color: Color,
  ) {
    super(engine, transform, layer)
    this.texture = new RectangleSprite(this, color)
    this.collider = 'box'
    this.static = true
  }
}
