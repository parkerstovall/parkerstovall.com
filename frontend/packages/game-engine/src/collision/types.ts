import type { Vector2D } from '../types'

export type CollisionInfo = {
  isColliding: boolean
  normal: Vector2D
  depth: number
}

export const NO_COLLISION: CollisionInfo = {
  isColliding: false,
  normal: { x: 0, y: 0 },
  depth: 0,
}

export type Collider = 'box' | 'circle'
