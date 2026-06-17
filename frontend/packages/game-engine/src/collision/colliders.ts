// export type Collider = {
//   type: 'box' | 'circle'
// }

import type { GameObject, Vector2D } from '../types'

export abstract class Collider {
  protected readonly gameObject: GameObject

  constructor(gameObject: GameObject) {
    this.gameObject = gameObject
  }
}

export abstract class PolygonCollider extends Collider {
  abstract getVertices(): Vector2D[]

  protected getRotatedVertex(vertex: Vector2D) {
    const { x, y, width, height, rotation } = this.gameObject.transform

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

    return { x: rotatedX, y: rotatedY }
  }
}

export class CircleCollider extends Collider {}

export class BoxCollider extends PolygonCollider {
  getVertices() {
    const { x, y, width, height, rotation } = this.gameObject.transform
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
      const { x: newX, y: newY } = this.getRotatedVertex(vertex)
      vertex.x = newX
      vertex.y = newY
    }

    return vertices
  }
}
