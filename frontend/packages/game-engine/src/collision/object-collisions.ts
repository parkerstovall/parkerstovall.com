import type { GameObject } from '../game-object'
import { type Vector2D } from '../types'
import { type CollisionInfo, NO_COLLISION } from './types'
import {
  getAxes,
  getAxisDotProducts,
  getCenter,
  getDotProduct,
  getPointDistance,
  getVertices,
  normalizeVector,
} from './math-extensions'

// MAIN ENTRY POINT
export const hasCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
): CollisionInfo => {
  if (!gameObjectA.collider || !gameObjectB.collider) {
    return NO_COLLISION
  }

  if (gameObjectA.collider === 'box' && gameObjectB.collider === 'box') {
    return detectBoxCollision(gameObjectA, gameObjectB)
  }

  if (gameObjectA.collider === 'circle' && gameObjectB.collider === 'circle') {
    return detectSimpleCircleCollision(gameObjectA, gameObjectB)
  }

  if (gameObjectA.collider === 'box') {
    // rect = A, circle = B -> function's rect->circle normal already reads as A->B
    return detectCircleBoxCollision(gameObjectA, gameObjectB)
  }

  // rect = B, circle = A -> function's normal reads as B->A, so flip it to A->B
  const result = detectCircleBoxCollision(gameObjectA, gameObjectB)
  if (!result.isColliding) {
    return result
  }
  return {
    ...result,
    normal: { x: -result.normal.x, y: -result.normal.y },
  }
}

// BOX - BOX COLLISIONS
const detectBoxCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
): CollisionInfo => {
  if (!gameObjectA.transform.rotation && !gameObjectB.transform.rotation) {
    return detectSimpeBoxCollision(gameObjectA, gameObjectB)
  } else {
    return detectSATCollision(gameObjectA, gameObjectB)
  }
}

const detectSimpeBoxCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
): CollisionInfo => {
  const a = gameObjectA.transform
  const b = gameObjectB.transform

  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

  if (overlapX <= 0 || overlapY <= 0) {
    return NO_COLLISION
  }

  // push out along whichever axis has the smaller overlap
  if (overlapX < overlapY) {
    const direction = a.x + a.width / 2 < b.x + b.width / 2 ? 1 : -1
    return {
      isColliding: true,
      normal: { x: direction, y: 0 },
      depth: overlapX,
    }
  }

  const direction = a.y + a.height / 2 < b.y + b.height / 2 ? 1 : -1
  return {
    isColliding: true,
    normal: { x: 0, y: direction },
    depth: overlapY,
  }
}

const detectSATCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
): CollisionInfo => {
  const verticesA = getVertices(gameObjectA)
  const verticesB = getVertices(gameObjectB)
  const axes: Vector2D[] = [...getAxes(verticesA), ...getAxes(verticesB)]

  let minOverlap = Infinity
  let minAxis: Vector2D | null = null

  for (const axis of axes) {
    // must normalize: raw edge-derived axes aren't unit length,
    // which would make "overlap" meaningless as a depth value
    const normalizedAxis = normalizeVector(axis)
    const { min: minA, max: maxA } = getAxisDotProducts(
      normalizedAxis,
      verticesA,
    )
    const { min: minB, max: maxB } = getAxisDotProducts(
      normalizedAxis,
      verticesB,
    )

    if (minA > maxB || minB > maxA) {
      return NO_COLLISION
    }

    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB)
    if (overlap < minOverlap) {
      minOverlap = overlap
      minAxis = normalizedAxis
    }
  }

  if (!minAxis) {
    return NO_COLLISION
  }

  // orient normal to point from A to B
  const centerA = getCenter(gameObjectA)
  const centerB = getCenter(gameObjectB)
  const centerDelta = { x: centerB.x - centerA.x, y: centerB.y - centerA.y }
  const direction = getDotProduct(centerDelta, minAxis) < 0 ? -1 : 1

  return {
    isColliding: true,
    normal: { x: minAxis.x * direction, y: minAxis.y * direction },
    depth: minOverlap,
  }
}

// CIRCLE - CIRCLE COLLISIONS
const detectSimpleCircleCollision = (
  gameObjectA: GameObject,
  gameObjectB: GameObject,
): CollisionInfo => {
  const radiusA = gameObjectA.transform.width / 2
  const radiusB = gameObjectB.transform.width / 2
  const centerA = {
    x: gameObjectA.transform.x + radiusA,
    y: gameObjectA.transform.y + radiusA,
  }
  const centerB = {
    x: gameObjectB.transform.x + radiusB,
    y: gameObjectB.transform.y + radiusB,
  }

  const distance = getPointDistance(centerA, centerB)
  const combinedRadius = radiusA + radiusB

  if (distance >= combinedRadius) {
    return NO_COLLISION
  }

  const normal =
    distance === 0
      ? { x: 1, y: 0 }
      : {
          x: (centerB.x - centerA.x) / distance,
          y: (centerB.y - centerA.y) / distance,
        }

  return {
    isColliding: true,
    normal,
    depth: combinedRadius - distance,
  }
}

// CIRCLE - BOX COLLISION
// normal points from rectObject toward circleObject
const detectCircleBoxCollision = (
  rectObject: GameObject,
  circleObject: GameObject,
): CollisionInfo => {
  const { x, y, width, height, rotation } = rectObject.transform
  const radius = circleObject.transform.width / 2
  const centerX = circleObject.transform.x + radius
  const centerY = circleObject.transform.y + radius

  const rectCenterX = x + width / 2
  const rectCenterY = y + height / 2

  // move circle center into the rectangle's local, unrotated space
  const dx = centerX - rectCenterX
  const dy = centerY - rectCenterY
  const angle = rotation ?? 0
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const localX = dx * cos - dy * sin
  const localY = dx * sin + dy * cos

  const halfW = width / 2
  const halfH = height / 2
  const clampedX = Math.max(-halfW, Math.min(halfW, localX))
  const clampedY = Math.max(-halfH, Math.min(halfH, localY))

  const isInside = localX === clampedX && localY === clampedY

  let localNormal: Vector2D
  let depth: number

  if (isInside) {
    // center is inside the box: push out along the axis of least penetration
    const distToRight = halfW - localX
    const distToLeft = localX + halfW
    const distToTop = halfH - localY
    const distToBottom = localY + halfH
    const minDist = Math.min(distToRight, distToLeft, distToTop, distToBottom)

    if (minDist === distToRight) {
      localNormal = { x: 1, y: 0 }
    } else if (minDist === distToLeft) {
      localNormal = { x: -1, y: 0 }
    } else if (minDist === distToTop) {
      localNormal = { x: 0, y: 1 }
    } else {
      localNormal = { x: 0, y: -1 }
    }
    depth = minDist + radius
  } else {
    const distX = localX - clampedX
    const distY = localY - clampedY
    const distSq = distX * distX + distY * distY

    if (distSq >= radius * radius) {
      return NO_COLLISION
    }

    const dist = Math.sqrt(distSq)
    localNormal =
      dist === 0 ? { x: 0, y: 1 } : { x: distX / dist, y: distY / dist }
    depth = radius - dist
  }

  // rotate normal back into world space
  const cosF = Math.cos(angle)
  const sinF = Math.sin(angle)

  return {
    isColliding: true,
    normal: {
      x: localNormal.x * cosF - localNormal.y * sinF,
      y: localNormal.x * sinF + localNormal.y * cosF,
    },
    depth,
  }
}
