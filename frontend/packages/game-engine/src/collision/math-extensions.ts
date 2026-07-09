import { frameNumber } from '../engine'
import type { GameObject } from '../game-object'
import { type Vector2D } from '../types'

type VertexCacheItem = {
  frameNumber: number
  Item: Vector2D[]
}

const vectorCache: Map<string, VertexCacheItem> = new Map()

export const clearMathCache = () => {
  vectorCache.clear()
}

export const removeObjectFromMathCache = (objectId: string) => {
  vectorCache.delete(objectId)
}

export const getAxisDotProducts = (axis: Vector2D, vertices: Vector2D[]) => {
  let min = getDotProduct(axis, vertices[0])
  let max = min
  for (let i = 1; i < vertices.length; i++) {
    const dotProduct = getDotProduct(axis, vertices[i])
    if (dotProduct < min) {
      min = dotProduct
    }

    if (dotProduct > max) {
      max = dotProduct
    }
  }

  return { min, max }
}

export const getAxes = (vertices: Vector2D[]) => {
  return [
    getEdgeAxis(vertices[0], vertices[1]),
    getEdgeAxis(vertices[1], vertices[2]),
  ] as Vector2D[]
}

export const getVertices = (gameObject: GameObject) => {
  let cacheItem = vectorCache.get(gameObject.objectId)
  if (!cacheItem || cacheItem.frameNumber !== frameNumber) {
    const vertices = getVerticesInner(gameObject)
    cacheItem = {
      frameNumber,
      Item: vertices,
    }
    vectorCache.set(gameObject.objectId, cacheItem)
  }
  return cacheItem.Item
}

export const getPointDistance = (pointA: Vector2D, pointB: Vector2D) => {
  const xSqure = Math.pow(pointA.x - pointB.x, 2)
  const ySquare = Math.pow(pointA.y - pointB.y, 2)

  return Math.sqrt(xSqure + ySquare)
}

export const getPointInRectangle = (
  point: Vector2D,
  gameObject: GameObject,
  vertices?: Vector2D[],
) => {
  const { x, y, width, height, rotation } = gameObject.transform

  if (!rotation) {
    return (
      point.x >= x &&
      point.x <= x + width &&
      point.y >= y &&
      point.y <= y + height
    )
  }

  vertices ??= getVertices(gameObject)

  const areaA = getTriangleArea(vertices[0], point, vertices[3])
  const areaB = getTriangleArea(vertices[3], point, vertices[2])
  const areaC = getTriangleArea(vertices[2], point, vertices[1])
  const areaD = getTriangleArea(vertices[1], point, vertices[0])
  const totalArea = areaA + areaB + areaC + areaD
  const rectArea = height * width

  return totalArea <= rectArea
}

export const getDotProduct = (vector1: Vector2D, vector2: Vector2D) => {
  return vector1.x * vector2.x + vector1.y * vector2.y
}

export const normalizeVector = (vector: Vector2D): Vector2D => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  if (length === 0) {
    return { x: 0, y: 0 }
  }
  return { x: vector.x / length, y: vector.y / length }
}

export const getCenter = (gameObject: GameObject): Vector2D => {
  const { x, y, width, height } = gameObject.transform
  return { x: x + width / 2, y: y + height / 2 }
}

const getEdgeAxis = (vertexA: Vector2D, vertexB: Vector2D) => {
  const edgeVector = {
    x: vertexA.x - vertexB.x,
    y: vertexA.y - vertexB.y,
  }

  return {
    x: edgeVector.y,
    y: edgeVector.x * -1,
  }
}

const getVerticesInner = (gameObject: GameObject) => {
  const { x, y, width, height, rotation } = gameObject.transform
  const vertices: Vector2D[] = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ]

  if (!rotation) {
    return vertices
  }

  for (const vertex of vertices) {
    const { x: newX, y: newY } = getRotatedVertex(gameObject, vertex)
    vertex.x = newX
    vertex.y = newY
  }

  return vertices
}

const getRotatedVertex = (gameObject: GameObject, vertex: Vector2D) => {
  const { x, y, width, height, rotation } = gameObject.transform

  const centerX = x + width / 2
  const centerY = y + height / 2

  const translatedX = vertex.x - centerX
  const translatedY = vertex.y - centerY

  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)

  let rotatedX = translatedX * cos - translatedY * sin
  let rotatedY = translatedY * cos + translatedX * sin

  rotatedX += centerX
  rotatedY += centerY

  return { x: rotatedX, y: rotatedY } as Vector2D
}

const getTriangleArea = (a: Vector2D, b: Vector2D, c: Vector2D) => {
  return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2
}
