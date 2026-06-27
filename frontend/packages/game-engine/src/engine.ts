import { CACHE_NAMES, type CACHE_KEYS } from './constants'
import { Chunk, type Scene, type Vector2D } from './types'
import { CollisionManager } from './collision/collision-manager'
import { KeystrokeManager } from './managers/keystroke-manager'
import type { Camera } from './rendering/camera'
import { getVertices } from './collision/math-extensions'
import type { GameObject } from './game-object'

export let frameNumber: number = 0

export class Engine {
  private readonly playerIds = new Map<string, number>()
  private readonly objectIdToChunkMap = new Map<string, Set<number>>()
  private readonly gameObjectCache = new Map<number, GameObject[]>()
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
  public isPaused = false

  constructor() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'p') return

      if (this.isPaused) {
        this.isPaused = false
        requestAnimationFrame(() => this.update())
      } else {
        this.isPaused = true
      }
    })
  }

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
    const index = this.players.push(player) - 1
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
    const vertices = getVertices(gameObject)

    let chunkIndexes = this.objectIdToChunkMap.get(gameObject.objectId)
    if (!chunkIndexes) {
      chunkIndexes = new Set()
    }

    const addedIndexes = new Set<number>()

    for (let i = 0; i < vertices.length; i++) {
      const vertexA = vertices[i]
      const vertexB = vertices[(i + 1) % vertices.length]

      let { x: xA, y: yA } = vertexA
      let { x: xB, y: yB } = vertexB
      if (xB < xA) {
        const tempX = xA
        xA = xB
        xB = tempX
      }

      if (yB < yA) {
        const tempY = yA
        yA = yB
        yB = tempY
      }

      const startY = yA
      while (xA <= xB) {
        yA = startY
        while (yA <= yB) {
          const { x: chunkX, y: chunkY } = this.getChunkCoords({ x: xA, y: yA })
          let chunkIndex = this.chunks.findIndex(
            (c) => c.startX === chunkX && c.startY === chunkY,
          )

          if (chunkIndex === -1 || !addedIndexes.has(chunkIndex)) {
            let chunk: Chunk
            if (chunkIndex > -1) {
              chunk = this.chunks[chunkIndex]
            } else {
              chunk = new Chunk(chunkX, chunkY)
              chunkIndex = this.chunks.push(chunk) - 1
            }

            addedIndexes.add(chunkIndex)
            chunk.addObject(gameObject)
            chunkIndexes.add(chunkIndex)
          }

          yA += this.renderSize
        }

        xA += this.renderSize
      }
    }

    this.objectIdToChunkMap.set(gameObject.objectId, chunkIndexes)
    return gameObject
  }

  public removeObject(gameObject: GameObject) {
    this.collisionManager.removeGameObject(gameObject.objectId)
    const chunkIndexes = this.objectIdToChunkMap.get(gameObject.objectId)
    if (!chunkIndexes) {
      return gameObject
    }

    this.objectIdToChunkMap.delete(gameObject.objectId)

    for (const chunkIndex of chunkIndexes) {
      this.chunks[chunkIndex].removeObject(gameObject)
    }

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
      .filter((value, index, self) => {
        return self.findIndex((g) => g.objectId === value.objectId) === index
      })

    gameObjects = func?.(gameObjects) ?? gameObjects
    this.gameObjectCache.set(cacheKey, gameObjects)
    return gameObjects
  }

  private update() {
    if (this.isPaused) {
      return
    }

    frameNumber++
    const frameStart = performance.now()
    this.deltaTime = Math.min((frameStart - this.lastFrameStart) / 1000, 0.1)
    this.lastFrameStart = frameStart

    const gameObjects = this.getGameObjects(CACHE_NAMES.BASIC)

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
      camera.paint(this.getActiveChunks())
    }

    this.collisionManager.detectChunkCollisions(
      this.getActiveChunks(),
      this.renderSize,
    )
    requestAnimationFrame(() => this.update())
  }

  private checkGameObjectChunk(gameObject: GameObject) {
    const vertices = getVertices(gameObject)

    const chunkIndexes: Set<number> = new Set()

    for (const vertex of vertices) {
      const { x, y } = this.getChunkCoords(vertex)
      const chunkIndex = this.chunks.findIndex(
        (c) => c.startX === x && c.startY === y,
      )

      if (chunkIndex > -1) {
        chunkIndexes.add(chunkIndex)
      }
    }

    const cachedChunkIndexes = this.objectIdToChunkMap.get(gameObject.objectId)
    if (cachedChunkIndexes) {
      let exactMatch = true

      for (const chunkIndex of cachedChunkIndexes) {
        if (!chunkIndexes.has(chunkIndex)) {
          exactMatch = false
          break
        }
      }

      if (exactMatch) {
        return // GameObject already assigned to the right chunks
      }
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
      const { x, y } = this.getChunkCoords(player.transform)
      for (const c of this.chunks) {
        if (
          !chunkIds.has(c.chunkId) &&
          !!c.gameObjects.length &&
          c.startX - x > -this.renderSize * 2 &&
          c.startY - y > -this.renderSize * 2 &&
          c.startX - x < this.renderSize * 2 &&
          c.startY - y < this.renderSize * 2
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

  private getChunkCoords(point: Vector2D) {
    const { x, y } = point
    const startX = Math.floor(x / this.renderSize) * this.renderSize
    const startY = Math.floor(y / this.renderSize) * this.renderSize
    return { x: startX, y: startY } as Vector2D
  }
}
