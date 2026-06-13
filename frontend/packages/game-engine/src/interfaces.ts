import type { Engine } from './engine'

export type Transform = {
  x: number
  y: number
  width: number
  height: number
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
  public readonly objectId: string

  protected readonly engine: Engine

  constructor(engine: Engine, position: Transform) {
    this.transform = position
    this.engine = engine
    this.objectId = crypto.randomUUID()
  }

  start?(): void
  destroy?(): void
  earlyUpdate?(): void
  update?(): void
  lateUpdate?(): void
}
