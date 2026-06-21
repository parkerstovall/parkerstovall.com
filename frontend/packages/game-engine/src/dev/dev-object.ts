import type { Engine } from '../engine'
import { GameObject, type Transform } from '../types'

export class DevObject extends GameObject {
  public tags: string[] = []
  public zIndex: number = -1

  constructor(
    engine: Engine,
    transform: Transform,
    layer: number,
    color: string,
  ) {
    super(engine, transform, layer)
    this.texture = {
      type: 'rectangle',
      color,
    }
    this.collider = 'box'
  }
}
