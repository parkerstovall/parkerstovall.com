import { LAYERS } from '../constants'
import type { Engine } from '../engine'
import { GameObject } from '../game-object'
import type { Color } from '../rendering'
import { Text } from '../textures/text'
import type { Transform } from '../types'

export class TextObject extends GameObject {
  constructor(
    engine: Engine,
    transform: Transform,
    text: string,
    color: Color = { r: 255, g: 255, b: 255 },
    alignment: 'center' | 'left' | 'right' = 'left',
    font: string = '24px serif',
  ) {
    super(engine, transform, LAYERS.UI_LAYER)
    this.texture = new Text(this, text, color, alignment, font)
    this.zIndex = 99999
  }
}
