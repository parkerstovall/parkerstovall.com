import { type LAYER_KEYS } from '../constants'
import type { Engine } from '../engine'
import { Player } from '../implementations'
import { RectangleSprite } from '../textures/rectangle-sprite'
import type { Color } from '../textures/textures'
import { type Transform } from '../types'

export class DevPlayer extends Player {
  public tags: string[] = []

  constructor(
    engine: Engine,
    transform: Transform,
    layer: LAYER_KEYS,
    color: Color,
  ) {
    super(engine, transform, layer, 50, 1)
    this.texture = new RectangleSprite(this, color)

    this.zIndex = 1
    this.collider = 'box'
  }
}
