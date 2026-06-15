import type { Chunk, GameObject, Scene } from './interfaces'
import { CollisionManager } from './managers/collision-manager'
import { KeystrokeManager } from './managers/keystroke-manager'
import type { Camera } from './rendering/camera'

export class Engine {
  private readonly objectIdMap: Map<string, number> = new Map()
  private readonly chunks: Chunk[] = []
  private readonly players: GameObject[] = []
  private readonly cameras: Camera[] = []
  private readonly renderSize = 250
  private readonly collisionManager = new CollisionManager()

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

    for (const camera of this.cameras) {
      camera.start?.()
    }

    this.lastFrameStart = performance.now()
    requestAnimationFrame(() => this.update())
  }

  public addPlayer(player: GameObject) {
    this.players.push(player)
    return this.addObject(player)
  }

  public removePlayer(gameObject: GameObject) {
    const index = this.players.findIndex(
      (p) => p.objectId === gameObject.objectId,
    )

    if (index > -1) {
      const player = this.players.splice(index, 1)[0]
      return this.removeObject(player)
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
      const chunk = this.chunks[chunkIndex]
      const objectIndex = chunk.gameObjects.push(gameObject)
      chunk.objectIdMap.set(gameObject.objectId, objectIndex - 1)
      this.objectIdMap.set(objectId, chunkIndex)
    } else {
      const chunk: Chunk = {
        gameObjects: [],
        objectIdMap: new Map(),
        startX: startX,
        startY: startY,
        chunkId: crypto.randomUUID(),
      }

      chunk.gameObjects.push(gameObject)
      chunk.objectIdMap.set(objectId, 0)
      const objectIndex = this.chunks.push(chunk) - 1
      this.objectIdMap.set(objectId, objectIndex)
    }

    return gameObject
  }

  public removeObject(gameObject: GameObject) {
    const chunkIndex = this.objectIdMap.get(gameObject.objectId)
    if (
      chunkIndex === undefined ||
      chunkIndex < 0 ||
      chunkIndex >= this.chunks.length
    ) {
      return gameObject
    }

    this.objectIdMap.delete(gameObject.objectId)
    const chunk = this.chunks[chunkIndex]
    const chunkObjectIndex = chunk.objectIdMap.get(gameObject.objectId)
    if (
      chunkObjectIndex === undefined ||
      chunkObjectIndex < 0 ||
      chunkObjectIndex >= chunk.gameObjects.length
    ) {
      return gameObject
    }

    if (chunk.gameObjects.length === 1) {
      chunk.gameObjects.splice(0, 1)
      chunk.objectIdMap.delete(gameObject.objectId)
      return gameObject
    }

    const replaceGo = chunk.gameObjects.pop()
    if (!replaceGo) {
      return gameObject
    }

    if (replaceGo.objectId !== gameObject.objectId) {
      chunk.gameObjects.splice(chunkObjectIndex, 1, replaceGo)
      chunk.objectIdMap.set(replaceGo.objectId, chunkObjectIndex)
    }

    chunk.objectIdMap.delete(gameObject.objectId)
    return gameObject
  }

  private update() {
    const frameStart = performance.now()
    this.deltaTime = Math.min((frameStart - this.lastFrameStart) / 1000, 0.1)
    this.lastFrameStart = frameStart

    const chunks = this.getActiveChunks()
    const gameObjects = [...chunks].map((c) => c.gameObjects).flat()

    for (const gameObject of gameObjects) {
      gameObject.earlyUpdate?.()
    }

    for (const camera of this.cameras) {
      camera.earlyUpdate?.()
    }

    for (const gameObject of gameObjects) {
      gameObject.update?.()
    }

    for (const camera of this.cameras) {
      camera.update?.()
    }

    for (const gameObject of gameObjects) {
      gameObject.lateUpdate?.()
    }

    for (const camera of this.cameras) {
      camera.lateUpdate?.()
    }

    for (const gameObject of gameObjects) {
      this.checkGameObjectChunk(gameObject)
    }

    for (const camera of this.cameras) {
      camera.paint(gameObjects)
    }

    this.collisionManager.detectChunkCollisions(chunks, this.renderSize)
    requestAnimationFrame(() => this.update())
  }

  private checkGameObjectChunk(gameObject: GameObject) {
    const { x, y } = gameObject.transform
    const startX = Math.floor(x / this.renderSize) * this.renderSize
    const startY = Math.floor(y / this.renderSize) * this.renderSize
    const chunkIndex = this.chunks.findIndex(
      (c) => c.startX === startX && c.startY === startY,
    )

    const cachedChunkIndex = this.objectIdMap.get(gameObject.objectId)
    if (cachedChunkIndex === chunkIndex) {
      return // GameObject is assigned to the correct chunk
    }

    this.removeObject(gameObject)
    this.addObject(gameObject)
  }

  private getActiveChunks() {
    const activeChunks: Chunk[] = []
    for (const player of this.players) {
      const { x, y } = player.transform
      const chunkX = Math.floor(x / this.renderSize) * this.renderSize
      const chunkY = Math.floor(y / this.renderSize) * this.renderSize
      activeChunks.push(
        ...this.chunks.filter(
          (c) =>
            !!c.gameObjects.length &&
            c.startX - chunkX > -this.renderSize &&
            c.startY - chunkY > -this.renderSize &&
            c.startX - chunkX < this.renderSize * 2 &&
            c.startY - chunkY < this.renderSize * 2,
        ),
      )
    }

    return new Set(activeChunks)
  }
}
