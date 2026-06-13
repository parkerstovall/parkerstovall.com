import type { Chunk, GameObject, Scene } from './interfaces'
import { KeystrokeManager } from './managers/keystroke-manager'
import type { Camera } from './rendering/camera'

export class Engine {
  private readonly objectIdMap: Map<string, number> = new Map()
  private readonly chunks: Chunk[] = []
  private readonly players: GameObject[] = []
  private readonly cameras: Camera[] = []
  private readonly renderSize = 100

  private lastFrameStart = 0
  private scene?: Scene

  public keyStrokeManager = new KeystrokeManager()
  public deltaTime: number = 0

  public setScene(scene: Scene) {
    this.scene?.destroy?.()
    this.scene = scene
    this.scene.load(this)

    for (const chunk of this.chunks) {
      for (const gameObject of chunk.gameObjects) {
        gameObject.start?.()
      }
    }

    for (const player of this.players) {
      player.start?.()
    }

    for (const camera of this.cameras) {
      camera.start?.()
    }

    this.lastFrameStart = performance.now()
    setInterval(() => this.update(), 1000)
  }

  public addPlayer(gameObject: GameObject) {
    this.players.push(gameObject)
    return gameObject
  }

  public removePlayer(gameObject: GameObject) {
    const index = this.players.findIndex(
      (p) => p.objectId === gameObject.objectId,
    )

    if (index > -1) {
      return this.players.splice(index, 1)[0]
    }

    return null
  }

  public addCamera(camera: Camera) {
    this.cameras.push(camera)
    return camera
  }

  public removeCamera(camera: Camera) {
    const index = this.cameras.findIndex((c) => c.objectId === camera.objectId)

    if (index > -1) {
      return this.cameras.splice(index, 1)[0]
    }

    return null
  }

  public addObject(gameObject: GameObject) {
    const startX =
      Math.floor(gameObject.transform.x / this.renderSize) * this.renderSize
    const startY =
      Math.floor(gameObject.transform.y / this.renderSize) * this.renderSize
    const chunkIndex = this.chunks.findIndex(
      (c) => c.startX === startX && c.startY === startY,
    )

    const objectId = gameObject.objectId
    if (chunkIndex > -1) {
      this.chunks[chunkIndex].gameObjects.push(gameObject)
      this.objectIdMap.set(objectId, chunkIndex)
    } else {
      const chunk: Chunk = {
        gameObjects: [],
        objectIdMap: new Map(),
        startX: startY,
        startY: startX,
      }

      chunk.gameObjects.push(gameObject)
      chunk.objectIdMap.set(objectId, 0)
      const chunkIndex = this.chunks.push(chunk) - 1
      this.objectIdMap.set(objectId, chunkIndex)
    }

    return gameObject
  }

  public removeObject(gameObject: GameObject) {
    const chunkIndex = this.objectIdMap.get(gameObject.objectId)
    if (!chunkIndex || chunkIndex < 0 || chunkIndex >= this.chunks.length) {
      return
    }

    this.objectIdMap.delete(gameObject.objectId)

    const chunk = this.chunks[chunkIndex]
    const chunkObjectIndex = chunk.objectIdMap.get(gameObject.objectId)
    if (
      !chunkObjectIndex ||
      chunkObjectIndex < 0 ||
      chunkObjectIndex >= chunk.gameObjects.length
    ) {
      return
    }

    const replaceGo = chunk.gameObjects.pop()
    if (!replaceGo) {
      chunk.gameObjects.splice(0, 1)
      chunk.objectIdMap.delete(gameObject.objectId)
      return
    }

    chunk.gameObjects.splice(chunkObjectIndex, 1, replaceGo)
    chunk.objectIdMap.delete(gameObject.objectId)
    chunk.objectIdMap.set(gameObject.objectId, chunkObjectIndex)
    return gameObject
  }

  private update() {
    const frameStart = performance.now()
    this.deltaTime = Math.min(frameStart - this.lastFrameStart / 1000, 0.1)
    this.lastFrameStart = frameStart

    const gameObjects = this.getActiveObjects()
    for (const gameObject of gameObjects) {
      gameObject.earlyUpdate?.()
    }

    for (const gameObject of gameObjects) {
      gameObject.update?.()
    }

    for (const gameObject of gameObjects) {
      gameObject.lateUpdate?.()
    }

    for (const gameObject of gameObjects) {
      this.checkGameObjectChunk(gameObject)
    }

    for (const camera of this.cameras) {
      camera.paint(gameObjects)
    }
  }

  private checkGameObjectChunk(gameObject: GameObject) {
    const startX =
      Math.floor(gameObject.transform.x / this.renderSize) * this.renderSize
    const startY =
      Math.floor(gameObject.transform.y / this.renderSize) * this.renderSize
    const chunkIndex = this.chunks.findIndex(
      (c) => c.startX === startX && c.startY === startY,
    )

    const cachedChunkIndex = this.objectIdMap.get(gameObject.objectId)
    if (cachedChunkIndex === chunkIndex) {
      return // GameObject is assigned to the correct chunk
    }

    if (cachedChunkIndex) {
      // Remove gameObject from cached chunk
      const oldChunk = this.chunks[cachedChunkIndex]
      const chunkGameObjectIndex = oldChunk.objectIdMap.get(gameObject.objectId)
      if (chunkGameObjectIndex) {
        const lastItem = oldChunk.gameObjects.pop()
        if (lastItem) {
          oldChunk.gameObjects.splice(chunkGameObjectIndex, 1, lastItem)
          oldChunk.objectIdMap.set(lastItem?.objectId, chunkGameObjectIndex)
        }
        oldChunk.objectIdMap.delete(gameObject.objectId)
      }
    }

    if (chunkIndex === -1) {
      const chunk: Chunk = {
        gameObjects: [],
        objectIdMap: new Map(),
        startX: startY,
        startY: startX,
      }

      chunk.gameObjects.push(gameObject)
      chunk.objectIdMap.set(gameObject.objectId, 0)
      const chunkIndex = this.chunks.push(chunk) - 1
      this.objectIdMap.set(gameObject.objectId, chunkIndex)
    }
  }

  private getActiveObjects() {
    const activeChunks: Chunk[] = []
    for (const player of this.players) {
      const { x, y } = player.transform
      activeChunks.push(
        ...this.chunks.filter(
          (c) =>
            c.startX - x > -this.renderSize &&
            c.startY - y > -this.renderSize &&
            c.startX - x < this.renderSize &&
            c.startY - y < this.renderSize,
        ),
      )
    }

    const chunkObjects = activeChunks.map((c) => c.gameObjects).flat()
    return [...new Set([...chunkObjects, ...this.cameras, ...this.players])]
  }
}
