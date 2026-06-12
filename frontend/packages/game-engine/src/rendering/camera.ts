import type { Engine } from '../engine'
import { GameObject, type Position } from '../interfaces'

export abstract class Camera extends GameObject {
  protected readonly parent: HTMLElement

  constructor(engine: Engine, position: Position, parentId: string) {
    super(engine, position)

    const maybeParent = document.getElementById(parentId)
    if (!maybeParent) {
      throw new Error(`There are no objects with the id ${parentId}`)
    }

    this.parent = maybeParent
  }

  abstract paint(gameObjects: GameObject[]): void
}
