import type { Collider } from './collision/colliders'
import { Directions, type Direction } from './constants'
import type { Engine } from './engine'
import type { Texture } from './rendering'
import type { Transform } from './types'

export abstract class GameObject {
  public transform: Transform
  public collider?: Collider
  public texture?: Texture
  public isActive: boolean = true
  public tags: string[] = []
  public zIndex: number = 0
  public readonly objectId: string
  public readonly layer: number

  protected readonly engine: Engine

  constructor(engine: Engine, position: Transform, layer: number) {
    this.transform = position
    this.engine = engine
    this.objectId = crypto.randomUUID()
    this.layer = layer
  }

  start?(): void
  destroy?(): void
  earlyUpdate?(): void
  update?(): void
  lateUpdate?(): void
  onCollisionEnter?(gameObject: GameObject): void
  onCollisionExit?(gameObject: GameObject): void

  protected move(dir: Direction, speed: number) {
    if (!this.transform.rotation) {
      this.moveSimple(dir, speed)
    } else {
      this.moveRotated(dir, speed)
    }
  }

  private moveRotated(dir: Direction, speed: number) {
    switch (dir) {
      case Directions.FORWARD:
        this.moveAtAngle(speed, this.transform.rotation)
        break
      case Directions.BACK:
        this.moveAtAngle(speed, this.transform.rotation + Math.PI)
        break
      case Directions.RIGHT:
        this.moveAtAngle(speed, this.transform.rotation + Math.PI / 2)
        break
      case Directions.LEFT:
        this.moveAtAngle(speed, this.transform.rotation - Math.PI / 2)
        break
    }
  }

  private moveAtAngle(speed: number, angle: number) {
    this.transform.x += speed * this.engine.deltaTime * Math.cos(angle)
    this.transform.y += speed * this.engine.deltaTime * Math.sin(angle)
  }

  private moveSimple(dir: Direction, speed: number) {
    switch (dir) {
      case Directions.FORWARD:
        this.transform.x += this.engine.deltaTime * speed
        break
      case Directions.BACK:
        this.transform.x -= this.engine.deltaTime * speed
        break
      case Directions.RIGHT:
        this.transform.y += this.engine.deltaTime * speed
        break
      case Directions.LEFT:
        this.transform.y -= this.engine.deltaTime * speed
        break
    }
  }
}
