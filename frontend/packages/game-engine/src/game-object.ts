import type { Collider, CollisionInfo } from './collision/types'
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
  public static: boolean = false
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
  onCollisionEnter?(gameObject: GameObject, collision: CollisionInfo): void
  onCollisionStay?(gameObject: GameObject, collision: CollisionInfo): void
  onCollisionExit?(gameObject: GameObject): void

  private static readonly COLLISION_PADDING = 0.5 // world units of guaranteed gap

  resolveCollision(other: GameObject, info: CollisionInfo): void {
    if (this.static) {
      return
    }

    const correctionDepth = info.depth + GameObject.COLLISION_PADDING

    if (other.static) {
      this.transform.x += info.normal.x * correctionDepth
      this.transform.y += info.normal.y * correctionDepth
      return
    }

    this.transform.x += info.normal.x * correctionDepth * 0.5
    this.transform.y += info.normal.y * correctionDepth * 0.5
  }

  protected move(dir: Direction, speed: number) {
    if (this.static) {
      return
    }

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
