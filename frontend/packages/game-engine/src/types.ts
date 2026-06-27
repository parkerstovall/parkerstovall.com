import { type LAYER_KEYS } from './constants'
import type { Engine } from './engine'
import type { GameObject } from './game-object'

export type Transform = {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export type Vector2D = { x: number; y: number }

export type Scene = {
  name: string
  load: (engine: Engine) => void
  destroy?: () => void
}

export class Chunk {
  public readonly gameObjects: GameObject[] = []
  public readonly objectIdIndexMap: Map<string, number> = new Map()
  public readonly chunkId: string = crypto.randomUUID()
  public startX: number
  public startY: number

  private objectsByLayer: Map<LAYER_KEYS, GameObject[]> = new Map()

  constructor(startX: number, startY: number) {
    this.startX = startX
    this.startY = startY
  }

  getLayerObjects(layer: LAYER_KEYS) {
    let filteredObjects = this.objectsByLayer.get(layer)
    if (filteredObjects) {
      return filteredObjects
    }

    filteredObjects = this.gameObjects.filter((o) => o.layer === layer)

    this.objectsByLayer.set(layer, filteredObjects)
    return filteredObjects
  }

  addObject(gameObject: GameObject) {
    const objectIndex = this.gameObjects.push(gameObject)
    this.objectIdIndexMap.set(gameObject.objectId, objectIndex - 1)
    this.setDirty()
  }

  removeObject(gameObject: GameObject) {
    const chunkObjectIndex = this.objectIdIndexMap.get(gameObject.objectId)
    this.objectIdIndexMap.delete(gameObject.objectId)

    if (
      chunkObjectIndex === undefined ||
      chunkObjectIndex < 0 ||
      chunkObjectIndex >= this.gameObjects.length
    ) {
      return
    }

    if (this.gameObjects.length === 1) {
      this.gameObjects.splice(0, 1)
      return
    }

    const replaceGo = this.gameObjects.pop()
    if (!replaceGo) {
      return
    }

    if (replaceGo.objectId !== gameObject.objectId) {
      this.gameObjects.splice(chunkObjectIndex, 1, replaceGo)
      this.objectIdIndexMap.set(replaceGo.objectId, chunkObjectIndex)
    }

    this.setDirty()
  }

  setDirty() {
    this.objectsByLayer.clear()
  }
}
