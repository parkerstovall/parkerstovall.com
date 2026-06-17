import { LAYERS } from '../constants'
import { GameObject, type Chunk, type Vector2D } from '../types'
import { BoxCollider, PolygonCollider } from './colliders'

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
    let collided = false
    if (
      !gameObjectA.transform.rotation &&
      !gameObjectB.transform.rotation &&
      gameObjectA.collider instanceof BoxCollider &&
      gameObjectB.collider instanceof BoxCollider
    ) {
      collided = this.detectBoxCollision(gameObjectA, gameObjectB)
    } else if (
      gameObjectA.collider instanceof PolygonCollider &&
      gameObjectB.collider instanceof PolygonCollider
    ) {
      collided = this.detectSATCollision(gameObjectA, gameObjectB)
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

  private detectSATCollision = (
    gameObjectA: GameObject,
    gameObjectB: GameObject,
  ) => {
    const verticesA = (gameObjectA.collider as PolygonCollider).getVertices()
    const verticesB = (gameObjectB.collider as PolygonCollider).getVertices()
    const axes: Vector2D[] = [
      ...this.getAxes(verticesA),
      ...this.getAxes(verticesB),
    ]

    for (const axis of axes) {
      const { min: minA, max: maxA } = this.getAxisDotProducts(axis, verticesA)
      const { min: minB, max: maxB } = this.getAxisDotProducts(axis, verticesB)

      if (minA > maxB || minB > maxA) {
        return false
      }
    }

    return true
  }

  private getAxisDotProducts(axis: Vector2D, vertices: Vector2D[]) {
    let min = this.getDotProduct(axis, vertices[0])
    let max = min
    for (let i = 1; i < vertices.length; i++) {
      const dotProduct = this.getDotProduct(axis, vertices[i])
      if (dotProduct < min) {
        min = dotProduct
      }

      if (dotProduct > max) {
        max = dotProduct
      }
    }

    return { min, max }
  }

  private getDotProduct(vector1: Vector2D, vector2: Vector2D) {
    return vector1.x * vector2.x + vector1.y * vector2.y
  }

  private getAxes(vertices: Vector2D[]) {
    const axes: Vector2D[] = []
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i]
      const nextVertex = vertices[i + 1 === vertices.length ? 0 : i + 1]

      const normalizedVector = {
        x: vertex.x - nextVertex.x,
        y: vertex.y - nextVertex.y,
      }

      axes.push({
        x: normalizedVector.y,
        y: normalizedVector.x * -1,
      })
    }

    return axes
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
