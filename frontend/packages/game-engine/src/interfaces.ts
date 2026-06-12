import type { Engine } from './engine'

export type Position = {
  x: number
  y: number
}

export type Collider = {
  type: string
}

export type RectangleCollider = Collider & {
  type: 'rect'
  width: number
  height: number
}

export type CircleCollider = Collider & {
  type: 'circle'
  radius: number
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

export type Texture = (Image | Sprite) & {
  width: number
  height: number
}

export abstract class GameObject {
  public position: Position
  public collider?: Collider
  public texture?: Texture
  public isActive: boolean = true
  public tags: string[] = []
  public readonly objectId: string

  protected readonly engine: Engine

  constructor(engine: Engine, position: Position) {
    this.position = position
    this.engine = engine
    this.objectId = Math.random().toString(36).substring(2)
  }

  start?(): void
  destroy?(): void
  earlyUpdate?(): void
  update?(): void
  lateUpdate?(): void
}
