import { GameObject, type Vector2D } from '../types'
import {
  getAxes,
  getAxisDotProducts,
  getPointDistance,
  getPointInRectangle,
  getVertices,
} from './math-extensions'

// MAIN ENTRY POINT
export const hasCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
) => {
  if (gameObjectA.collider === 'box' && gameObjectB.collider === 'box') {
    return detectBoxCollision(gameObjectA, gameObjectB)
  } else if (
    gameObjectA.collider === 'circle' &&
    gameObjectB.collider === 'circle'
  ) {
    return detectSimpleCircleCollision(gameObjectA, gameObjectB)
  }

  if (gameObjectA.collider === 'box') {
    return detectCircleBoxCollision(gameObjectA, gameObjectB)
  }

  return detectCircleBoxCollision(gameObjectB, gameObjectA)
}

// BOX - BOX COLLISIONS
const detectBoxCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
) => {
  if (!gameObjectA.transform.rotation && !gameObjectB.transform.rotation) {
    return detectSimpeBoxCollision(gameObjectA, gameObjectB)
  } else {
    return detectSATCollision(gameObjectA, gameObjectB)
  }
}

const detectSimpeBoxCollision = (
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

const detectSATCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
) => {
  const verticesA = getVertices(gameObjectA)
  const verticesB = getVertices(gameObjectB)
  const axes: Vector2D[] = [...getAxes(verticesA), ...getAxes(verticesB)]

  for (const axis of axes) {
    const { min: minA, max: maxA } = getAxisDotProducts(axis, verticesA)
    const { min: minB, max: maxB } = getAxisDotProducts(axis, verticesB)

    if (minA > maxB || minB > maxA) {
      return false
    }
  }

  return true
}

// CIRCLE - CIRCLE COLLISIONS
const detectSimpleCircleCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
) => {
  const radiusA = gameObjectA.transform.width / 2
  const radiusB = gameObjectB.transform.width / 2

  const centerXA = gameObjectA.transform.x + radiusA
  const centerYA = gameObjectA.transform.y + radiusA

  const centerXB = gameObjectB.transform.x + radiusB
  const centerYB = gameObjectB.transform.y + radiusB

  const distance = getPointDistance(
    { x: centerXA, y: centerYA },
    { x: centerXB, y: centerYB },
  )

  return distance <= radiusA + radiusB
}

// CIRCLE - BOX COLLISION
const detectCircleBoxCollision = (
  rectObject: GameObject,
  circleObject: GameObject,
) => {
  const vertices = getVertices(rectObject)

  const radius = circleObject.transform.width / 2
  const center = {
    x: circleObject.transform.x + radius,
    y: circleObject.transform.y + radius,
  }

  if (getPointInRectangle(center, rectObject, vertices)) {
    return true
  }

  for (let i = 0; i < vertices.length; i++) {
    const vertexA = vertices[i]
    const vertexB = vertices[(i + 1) % vertices.length]

    const edgeLength = getPointDistance(vertexA, vertexB)

    const leftSideX = (center.x - vertexA.x) * (vertexB.x - vertexA.x)
    const leftSideY = (center.y - vertexA.y) * (vertexB.y - vertexA.y)
    const rightSide = edgeLength * edgeLength
    const dot = (leftSideX + leftSideY) / rightSide
    const dotClamp = Math.max(0, Math.min(dot, 1))

    const closest = {
      x: vertexA.x + dotClamp * (vertexB.x - vertexA.x),
      y: vertexA.y + dotClamp * (vertexB.y - vertexA.y),
    }

    const distance = getPointDistance(closest, center)
    if (distance <= radius) {
      return true
    }
  }

  return false
}
