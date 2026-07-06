import { Directions, type LAYER_KEYS } from '../constants'
import type { Engine } from '../engine'
import { GameObject } from '../game-object'
import type { Transform } from '../types'

export class Player extends GameObject {
  protected speed: number
  protected speedAngle: number

  constructor(
    engine: Engine,
    transform: Transform,
    layer: LAYER_KEYS,
    speed: number,
    speedAngle: number,
  ) {
    super(engine, transform, layer)
    this.speed = speed
    this.speedAngle = speedAngle
  }

  earlyUpdate() {
    if (this.engine.keyStrokeManager.has('a')) {
      this.move(Directions.LEFT, this.speed)
    }

    if (this.engine.keyStrokeManager.has('d')) {
      this.move(Directions.RIGHT, this.speed)
    }

    if (this.engine.keyStrokeManager.has('w')) {
      this.move(Directions.FORWARD, this.speed)
    }

    if (this.engine.keyStrokeManager.has('s')) {
      this.move(Directions.BACK, this.speed)
    }

    if (this.engine.keyStrokeManager.has('q')) {
      this.transform.rotation -= this.speedAngle * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.has('e')) {
      this.transform.rotation += this.speedAngle * this.engine.deltaTime
    }
  }
}
