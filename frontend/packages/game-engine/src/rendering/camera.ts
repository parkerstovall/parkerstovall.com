import type { Engine } from '../engine'
import { GameObject } from '../game-object'
import { Chunk, type Transform } from '../types'

export abstract class Camera extends GameObject {
  protected readonly parent: HTMLElement

  constructor(
    engine: Engine,
    position: Transform,
    layer: number,
    parentId: string,
  ) {
    super(engine, position, layer)

    const maybeParent = document.getElementById(parentId)
    if (!maybeParent) {
      throw new Error(`There are no objects with the id ${parentId}`)
    }

    this.parent = maybeParent
  }

  abstract paint(chunks: Chunk[]): void
  abstract destroy(): void
}
