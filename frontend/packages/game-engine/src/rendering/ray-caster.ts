import { getPointDistance, getVertices } from '../collision/math-extensions'
import { CACHE_NAMES } from '../constants'
import type { Engine } from '../engine'
import type { GameObject, Transform, Vector2D } from '../types'
import { Camera } from './camera'

type RayCastHit = {
  object: GameObject
  point: Vector2D
  distance: number
}

export class RayCastCamera extends Camera {
  private readonly backgroundLayer: HTMLCanvasElement
  private readonly gameLayer: HTMLCanvasElement
  private readonly uiLayer: HTMLCanvasElement
  private readonly width: number
  private readonly height: number

  private readonly anchor: GameObject

  constructor(
    engine: Engine,
    position: Transform,
    layer: number,
    width: number,
    height: number,
    parentId: string,
    anchor: GameObject,
  ) {
    super(engine, position, layer, parentId)

    this.width = width
    this.height = height
    this.parent.style.width = width + 'px'
    this.parent.style.height = height + 'px'
    this.parent.style.position = 'relative'
    this.anchor = anchor

    this.backgroundLayer = this.createCanvas('background-layer')
    this.backgroundLayer.style.zIndex = '-1'
    this.parent.appendChild(this.backgroundLayer)

    this.gameLayer = this.createCanvas('game-layer')
    this.gameLayer.style.zIndex = '0'
    this.parent.appendChild(this.gameLayer)

    this.uiLayer = this.createCanvas('ui-layer')
    this.uiLayer.style.zIndex = '1'
    this.parent.appendChild(this.uiLayer)
  }

  private createCanvas(id: string) {
    const canvas = document.createElement('canvas')
    canvas.id = id
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    return canvas
  }

  paint() {
    const objects = this.engine.getGameObjects(
      CACHE_NAMES.IGNORE_PLAYER,
      (gameObjects) =>
        gameObjects.filter((g) => g.objectId !== this.anchor.objectId),
    )
    this.rayCast(objects)
  }

  private rayCast(objects: GameObject[]) {
    console.log('casting')
    const rays = this.width
    const sliceWidth = this.width / rays
    const fov = 60
    const fovRad = fov * (Math.PI / 180)
    const angleStep = fovRad / rays // FOV
    const rotation = this.anchor.transform.rotation
    const ctx = this.gameLayer.getContext('2d')!
    ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < rays; i++) {
      const rayAngle = rotation - fovRad / 2 + i * angleStep
      const result = this.castRay(rayAngle, objects)
      if (result) {
        this.drawItem(i, result.wallHeight, sliceWidth, ctx)
      }
    }
  }

  private drawItem(
    i: number,
    wallHeight: number,
    sliceWidth: number,
    ctx: CanvasRenderingContext2D,
  ) {
    const minY = Math.floor(this.height / 2 - wallHeight / 2)
    ctx.fillStyle = `rgb(180, 0, 180)`
    ctx.fillRect(i * sliceWidth, minY, sliceWidth, wallHeight)
  }

  private castRay(rayAngle: number, gameObjects: GameObject[]) {
    const rayStart = {
      x: this.anchor.transform.x,
      y: this.anchor.transform.y,
    }

    const endX = rayStart.x + this.engine.renderSize * Math.cos(rayAngle)
    const endY = rayStart.y + this.engine.renderSize * Math.sin(rayAngle)

    const rayEnd = {
      x: endX,
      y: endY,
    }

    const hits = this.getHits(rayStart, rayEnd, gameObjects)
    if (!hits.length) {
      return
    }

    let closestHit = hits[0].distance
    let hit: RayCastHit = hits[0]
    for (let i = 1; i < hits.length; i++) {
      if (hits[i].distance < closestHit) {
        hit = hits[i]
        closestHit = hit.distance
      }
    }

    const fovRad = 60 * (Math.PI / 180)
    const projectionPlaneDistance = this.height / 2 / Math.tan(fovRad / 2)
    const wallHeight =
      (hit.object.transform.height * projectionPlaneDistance) /
      (hit.distance * Math.cos(rayAngle - this.anchor.transform.rotation))

    return { distance: hit.distance, wallHeight }
  }

  private getHits(
    rayStart: Vector2D,
    rayEnd: Vector2D,
    gameObjects: GameObject[],
  ) {
    const hits: RayCastHit[] = []
    for (const gameObject of gameObjects) {
      const vertices = getVertices(gameObject)
      let closestDistance = Infinity
      let closestPoint: Vector2D | null = null

      for (let i = 0; i < vertices.length; i++) {
        const vertexA = vertices[i]
        const vertexB = vertices[(i + 1) % vertices.length]

        const point = this.getIntersectionPoint(
          rayStart,
          rayEnd,
          vertexA,
          vertexB,
        )

        if (!point) {
          continue
        }

        if (point.distance < closestDistance) {
          closestPoint = point
          closestDistance = point.distance
        }
      }

      if (closestPoint) {
        hits.push({
          object: gameObject,
          point: closestPoint,
          distance: closestDistance,
        })
      }
    }

    return hits
  }

  private getIntersectionPoint(
    rayStart: Vector2D,
    rayEnd: Vector2D,
    edgeStart: Vector2D,
    edgeEnd: Vector2D,
  ) {
    // calculate the distance to intersection point
    const uA =
      ((edgeEnd.x - edgeStart.x) * (rayStart.y - edgeStart.y) -
        (edgeEnd.y - edgeStart.y) * (rayStart.x - edgeStart.x)) /
      ((edgeEnd.y - edgeStart.y) * (rayEnd.x - rayStart.x) -
        (edgeEnd.x - edgeStart.x) * (rayEnd.y - rayStart.y))
    const uB =
      ((rayEnd.x - rayStart.x) * (rayStart.y - edgeStart.y) -
        (rayEnd.y - rayStart.y) * (rayStart.x - edgeStart.x)) /
      ((edgeEnd.y - edgeStart.y) * (rayEnd.x - rayStart.x) -
        (edgeEnd.x - edgeStart.x) * (rayEnd.y - rayStart.y))

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      const intersectionX = rayStart.x + uA * (rayEnd.x - rayStart.x)
      const intersectionY = rayStart.y + uA * (rayEnd.y - rayStart.y)
      const rayLength = getPointDistance(rayStart, rayEnd)

      return {
        distance: uA * rayLength,
        x: intersectionX,
        y: intersectionY,
      }
    }

    return null
  }
}
