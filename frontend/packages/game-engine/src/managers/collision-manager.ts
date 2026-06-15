import { GameObject, type Chunk } from '../interfaces'

export class CollisionManager {
  private readonly currentCollisions: Set<string> = new Set()

  public detectChunkCollisions = (chunks: Set<Chunk>, chunkSize: number) => {
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
    for (let i = 0; i < chunk.gameObjects.length; i++) {
      for (let j = i + 1; j < chunk.gameObjects.length; j++) {
        this.detectObjectCollision(chunk.gameObjects[i], chunk.gameObjects[j])
      }
    }
  }

  private detectInterChunkObjectCollisions = (chunkA: Chunk, chunkB: Chunk) => {
    for (const gameObjectA of chunkA.gameObjects) {
      for (const gameObjectB of chunkB.gameObjects) {
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
    let collided = false
    if (
      gameObjectA.collider?.type === 'box' &&
      gameObjectB.collider?.type === 'box'
    ) {
      collided = this.detectBoxCollision(gameObjectA, gameObjectB)
    }

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

  private detectBoxCollision = (
    gameObjectA: GameObject,
    gameObjectB: GameObject,
  ) => {
    if (
      gameObjectA.transform.x + gameObjectA.transform.width <
      gameObjectB.transform.x
    ) {
      return false
    }

    if (
      gameObjectA.transform.x >
      gameObjectB.transform.x + gameObjectB.transform.width
    ) {
      return false
    }

    if (
      gameObjectA.transform.y + gameObjectA.transform.height <
      gameObjectB.transform.y
    ) {
      return false
    }

    if (
      gameObjectA.transform.y >
      gameObjectB.transform.y + gameObjectB.transform.height
    ) {
      return false
    }

    return true
  }

  private getNearbyChunks = (
    searchChunk: Chunk,
    chunks: Set<Chunk>,
    chunkSize: number,
  ) => {
    const nearbyChunks: Set<Chunk> = new Set()
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
        nearbyChunks.add(chunk)
      }
    }

    return nearbyChunks
  }

  private getCacheKey = (...values: string[]) => {
    return values.sort().join(':')
  }
}
