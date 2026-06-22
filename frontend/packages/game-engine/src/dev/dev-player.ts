import type { Engine } from '../engine'
import type { Color, Sprite } from '../rendering/textures'
import { GameObject, type Transform } from '../types'

export class DevPlayer extends GameObject {
  public tags: string[] = []

  private speedX: number = 125
  private speedY: number = 125
  private speedAngle: number = 0.35
  private readonly text: Sprite

  constructor(
    engine: Engine,
    transform: Transform,
    layer: number,
    color: Color,
  ) {
    super(engine, transform, layer)
    this.texture = {
      type: 'rectangle',
      color,
    }

    this.text = this.texture
    this.zIndex = 1
    this.collider = 'box'
    this.transform.rotation = -0.75
  }

  earlyUpdate(): void {
    if (this.engine.keyStrokeManager.pressedKeys.has('a')) {
      this.transform.x -= this.speedX * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('d')) {
      this.transform.x += this.speedX * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('w')) {
      this.transform.y -= this.speedY * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('s')) {
      this.transform.y += this.speedY * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('q')) {
      this.transform.rotation -= this.speedAngle * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('e')) {
      this.transform.rotation += this.speedAngle * this.engine.deltaTime
    }
  }

  private hasLogged = false
  update() {
    if (!this.hasLogged && this.engine.keyStrokeManager.pressedKeys.has('t')) {
      this.hasLogged = true
    } else if (!this.engine.keyStrokeManager.pressedKeys.has('t')) {
      this.hasLogged = false
    }
  }

  onCollisionEnter?(gameObject: GameObject) {
    console.log(
      `I ${this.text?.color} collided with ${(gameObject.texture as Sprite)?.color}`,
    )
  }

  onCollisionExit?(gameObject: GameObject) {
    console.log(
      `I ${this.text?.color} am no longer colliding with ${(gameObject.texture as Sprite)?.color}`,
    )
  }
}
