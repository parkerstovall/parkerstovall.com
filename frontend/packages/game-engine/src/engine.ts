import type { CACHE_KEYS } from './constants'
import { Chunk, GameObject, type Scene } from './types'
import { CollisionManager } from './collision/collision-manager'
import { KeystrokeManager } from './managers/keystroke-manager'
import type { Camera } from './rendering/camera'

export let frameNumber: number = 0

export class Engine {
  private readonly playerIds: Map<string, number> = new Map()
  private readonly objectIdMap: Map<string, number> = new Map()
  private readonly gameObjectCache: Map<number, GameObject[]> = new Map()
  private readonly chunks: Chunk[] = []
  private readonly players: GameObject[] = []
  private readonly cameras: Camera[] = []
  private readonly collisionManager = new CollisionManager()

  private lastFrameStart = 0
  private scene?: Scene
  private activeChunks: Chunk[] | null = null

  public keyStrokeManager = new KeystrokeManager()
  public deltaTime: number = 0
  public renderSize = 500

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
    const index = this.players.push(player)
    this.playerIds.set(player.objectId, index)
    return this.addObject(player)
  }

  public removePlayer(gameObject: GameObject) {
    const index = this.playerIds.get(gameObject.objectId)

    if (index) {
      const player = this.players.splice(index, 1)[0]
      this.playerIds.delete(player.objectId)
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
    let chunkIndex = this.chunks.findIndex(
      (c) => c.startX === startX && c.startY === startY,
    )

    let chunk: Chunk
    if (chunkIndex > -1) {
      chunk = this.chunks[chunkIndex]
    } else {
      chunk = new Chunk(startX, startY)
      chunkIndex = this.chunks.push(chunk) - 1
    }

    chunk.addObject(gameObject)
    this.objectIdMap.set(gameObject.objectId, chunkIndex)

    return gameObject
  }

  public removeObject(gameObject: GameObject) {
    this.collisionManager.removeGameObject(gameObject.objectId)
    const chunkIndex = this.objectIdMap.get(gameObject.objectId)
    if (
      chunkIndex === undefined ||
      chunkIndex < 0 ||
      chunkIndex >= this.chunks.length
    ) {
      return gameObject
    }

    this.objectIdMap.delete(gameObject.objectId)
    this.chunks[chunkIndex].removeObject(gameObject)
    return gameObject
  }

  public getGameObjects(
    cacheKey: CACHE_KEYS,
    func?: (gameObjects: GameObject[]) => GameObject[],
  ) {
    let gameObjects = this.gameObjectCache.get(cacheKey)
    if (gameObjects) {
      return gameObjects
    }

    gameObjects = this.getActiveChunks()
      .map((c) => c.gameObjects)
      .flat()

    gameObjects = func?.(gameObjects) ?? gameObjects
    this.gameObjectCache.set(cacheKey, gameObjects)
    return gameObjects
  }

  private update() {
    frameNumber++
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
      camera.paint(chunks)
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

    for (const player of this.players) {
      if (player.objectId === gameObject.objectId) {
        this.setDirty()
        break
      }
    }
  }

  private getActiveChunks() {
    if (this.activeChunks) {
      return this.activeChunks
    }

    const activeChunks: Chunk[] = []
    const chunkIds: Set<string> = new Set()

    for (const player of this.players) {
      const { x, y } = player.transform
      const chunkX = Math.floor(x / this.renderSize) * this.renderSize
      const chunkY = Math.floor(y / this.renderSize) * this.renderSize
      for (const c of this.chunks) {
        if (
          !chunkIds.has(c.chunkId) &&
          !!c.gameObjects.length &&
          c.startX - chunkX > -this.renderSize &&
          c.startY - chunkY > -this.renderSize &&
          c.startX - chunkX < this.renderSize * 2 &&
          c.startY - chunkY < this.renderSize * 2
        ) {
          activeChunks.push(c)
          chunkIds.add(c.chunkId)
        }
      }
    }

    return (this.activeChunks ??= activeChunks)
  }

  private setDirty() {
    this.activeChunks = null
    this.gameObjectCache.clear()
  }
}
