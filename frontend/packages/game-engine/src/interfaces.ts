import type { Engine } from './engine'

export type Transform = {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export type Collider = {
  type: 'box' | 'circle'
}

export interface Scene {
  name: string
  load: (engine: Engine) => void
  destroy?: () => void
}

export type Chunk = {
  gameObjects: GameObject[]
  objectIdMap: Map<string, number>
  startX: number
  startY: number
  chunkId: string
}

export type Sprite = {
  type: 'circle' | 'rectangle'
  color: string
}

export type Image = {
  type: 'image'
  image: CanvasImageSource
}

export type Texture = Image | Sprite

export abstract class GameObject {
  public transform: Transform
  public collider?: Collider
  public texture?: Texture
  public isActive: boolean = true
  public tags: string[] = []
  public zIndex: number = 0
  public readonly objectId: string
  public readonly layer: string

  protected readonly engine: Engine

  constructor(engine: Engine, position: Transform, layer: string) {
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
}
