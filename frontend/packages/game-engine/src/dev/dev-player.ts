import { type LAYER_KEYS } from '../constants'
import type { Engine } from '../engine'
import { Player } from '../implementations'
import type { Color } from '../rendering/textures'
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
    this.texture = {
      type: 'rectangle',
      color,
    }

    this.zIndex = 1
    this.collider = 'box'
  }
}
