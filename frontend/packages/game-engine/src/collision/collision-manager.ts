import { LAYERS } from '../constants'
import { GameObject, type Chunk } from '../types'
import { hasCollision } from './object-collisions'

export class CollisionManager {
  private readonly currentCollisions: Set<string> = new Set()

  public detectChunkCollisions = (chunks: Chunk[], chunkSize: number) => {
    const chunkCollisionCache = new Set<string>()

    for (const chunk of chunks) {
      const nearbyChunks = [
        ...this.getNearbyChunks(chunk, chunks, chunkSize),
        chunk,
      ]
      for (const nearbyChunk of nearbyChunks) {
        const cacheKey = this.getCacheKey(chunk.chunkId, nearbyChunk.chunkId)
        if (chunkCollisionCache.has(cacheKey)) {
          continue
        }

        chunkCollisionCache.add(cacheKey)

        if (chunk.chunkId === nearbyChunk.chunkId) {
          this.detectIntraChunkObjectCollisions(chunk)
          continue
        }

        this.detectInterChunkObjectCollisions(chunk, nearbyChunk)
      }
    }
  }

  private detectIntraChunkObjectCollisions = (chunk: Chunk) => {
    const gameObjects = chunk.getLayerObjects(LAYERS.GAME_LAYER)
    for (let i = 0; i < gameObjects.length; i++) {
      for (let j = i + 1; j < gameObjects.length; j++) {
        this.detectObjectCollision(gameObjects[i], gameObjects[j])
      }
    }
  }

  private detectInterChunkObjectCollisions = (chunkA: Chunk, chunkB: Chunk) => {
    for (const gameObjectA of chunkA.getLayerObjects(LAYERS.GAME_LAYER)) {
      for (const gameObjectB of chunkB.getLayerObjects(LAYERS.GAME_LAYER)) {
        if (gameObjectA.objectId === gameObjectB.objectId) {
          continue
        }

        this.detectObjectCollision(gameObjectA, gameObjectB)
      }
    }
  }

  private detectObjectCollision = (
    gameObjectA: GameObject,
    gameObjectB: GameObject,
  ) => {
    const collided = hasCollision(gameObjectA, gameObjectB)

    const cacheKey = this.getCacheKey(
      gameObjectA.objectId,
      gameObjectB.objectId,
    )

    if (collided) {
      if (this.currentCollisions.has(cacheKey)) {
        return
      }

      this.currentCollisions.add(cacheKey)
      gameObjectA.onCollisionEnter?.(gameObjectB)
      gameObjectB.onCollisionEnter?.(gameObjectA)
      return
    }

    if (this.currentCollisions.has(cacheKey)) {
      this.currentCollisions.delete(cacheKey)
      gameObjectA.onCollisionExit?.(gameObjectB)
      gameObjectB.onCollisionExit?.(gameObjectA)
    }
  }

  private getNearbyChunks = (
    searchChunk: Chunk,
    chunks: Chunk[],
    chunkSize: number,
  ) => {
    const nearbyChunks: Chunk[] = []
    const margin = chunkSize / 5
    const bounds = {
      minX: searchChunk.startX - chunkSize - margin,
      minY: searchChunk.startY - chunkSize - margin,
      maxX: searchChunk.startX + chunkSize + margin,
      maxY: searchChunk.startY + chunkSize + margin,
    }

    for (const chunk of chunks) {
      if (
        chunk.startX > bounds.minX &&
        chunk.startX < bounds.maxX &&
        chunk.startY > bounds.minY &&
        chunk.startY < bounds.maxY
      ) {
        nearbyChunks.push(chunk)
      }
    }

    return nearbyChunks
  }

  private getCacheKey = (...values: string[]) => {
    return values.sort().join(':')
  }
}
