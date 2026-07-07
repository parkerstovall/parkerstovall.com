import { getVertices } from '../collision/math-extensions'
import { CACHE_NAMES, LAYERS } from '../constants'
import type { Engine } from '../engine'
import type { GameObject } from '../game-object'
import type { Transform, Vector2D } from '../types'
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
  private readonly fov = 60
  private readonly fovRad = this.fov * (Math.PI / 180)
  private readonly projectionPlaneDistance: number

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

    this.projectionPlaneDistance = this.height / 2 / Math.tan(this.fovRad / 2)
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
    let objects = this.engine.getGameObjects(
      CACHE_NAMES.IGNORE_PLAYER,
      (gameObjects) =>
        gameObjects.filter(
          (g) =>
            g.objectId !== this.anchor.objectId &&
            !!g.texture &&
            g.layer === LAYERS.GAME_LAYER,
        ),
    )

    const bgObjects = this.engine.getGameObjects(
      CACHE_NAMES.BACKGROUND,
      (gameObjects) =>
        gameObjects.filter(
          (g) => !!g.texture && g.layer === LAYERS.BACKGROUND_LAYER,
        ),
    )

    const ctx = this.gameLayer.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, this.width, this.height)

      for (const object of bgObjects) {
        //this.drawSimpleItem(object, ctx)
        object.texture?.paint2d?.(ctx)
      }
    }

    objects = this.filterObjects(objects)
    this.rayCast(objects)
  }

  //private drawSimpleItem(object: GameObject, ctx: CanvasRenderingContext2D) {
  // const texture = object.texture!
  // const { x, y, width, height, rotation } = object.transform

  // if (rotation) {
  //   ctx.save()
  //   const centerX = x + width / 2
  //   const centerY = y + height / 2
  //   ctx.translate(centerX, centerY)
  //   ctx.rotate(rotation)
  //   ctx.translate(-centerX, -centerY)
  // }

  // switch (texture.type) {
  //   case 'rectangle':
  //     ctx.fillStyle = getRGB(texture.color)
  //     ctx.fillRect(x, y, width, height)
  //     break
  //   case 'circle':
  //     const centerX = x + width / 2
  //     const centerY = y + height / 2
  //     ctx.fillStyle = getRGB(texture.color)
  //     ctx.beginPath()
  //     ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI)
  //     ctx.fill()
  //     break
  //   case 'image':
  //     ctx.drawImage(texture.image, x, y, width, height)
  // }

  // if (rotation) {
  //   ctx.restore()
  // }
  //}

  private filterObjects(gameObjects: GameObject[]) {
    const rotation = this.anchor.transform.rotation
    const camX = this.anchor.transform.x + this.anchor.transform.width / 2
    const camY = this.anchor.transform.y + this.anchor.transform.height / 2
    const halfFov = this.fovRad / 2
    const maxDistance = this.engine.renderSize

    return gameObjects.filter((object) => {
      const vertices = getVertices(object)

      let cx = 0
      let cy = 0

      for (const v of vertices) {
        cx += v.x
        cy += v.y
      }

      cx /= vertices.length
      cy /= vertices.length

      let radius = 0
      for (const v of vertices) {
        const d = Math.hypot(v.x - cx, v.y - cy)
        if (d > radius) radius = d
      }

      const dx = cx - camX
      const dy = cy - camY
      const distance = Math.hypot(dx, dy)

      if (distance - radius > maxDistance) return false // too far away

      let relAngle = Math.atan2(dy, dx) - rotation
      relAngle =
        ((((relAngle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
          (2 * Math.PI)) -
        Math.PI

      const angularRadius =
        distance > radius ? Math.asin(radius / distance) : Math.PI // camera is on/inside the object

      return (
        relAngle + angularRadius >= -halfFov &&
        relAngle - angularRadius <= halfFov
      )
    })
  }

  private rayCast(objects: GameObject[]) {
    const rays = this.width
    const sliceWidth = this.width / rays
    const angleStep = this.fovRad / rays // FOV
    const rotation = this.anchor.transform.rotation
    const ctx = this.gameLayer.getContext('2d')!

    for (let i = 0; i < rays; i++) {
      const rayAngle = rotation - this.fovRad / 2 + i * angleStep
      const result = this.castRay(rayAngle, objects)
      if (result) {
        this.drawItem(
          i,
          result.wallHeight,
          sliceWidth,
          ctx,
          result.object,
          result.distance,
        )
      }
    }
  }

  private drawItem(
    i: number,
    wallHeight: number,
    sliceWidth: number,
    ctx: CanvasRenderingContext2D,
    object: GameObject,
    distance: number,
  ) {
    const shade = 1 - distance / this.engine.renderSize
    const minY = Math.floor(this.height / 2 - wallHeight / 2)

    object.texture?.paintRay?.(ctx, shade, {
      x: i * sliceWidth,
      y: minY,
      width: sliceWidth,
      height: wallHeight,
      rotation: 0,
    })
  }

  private castRay(rayAngle: number, gameObjects: GameObject[]) {
    const rayStart = {
      x: this.anchor.transform.x + this.anchor.transform.width / 2,
      y: this.anchor.transform.y + this.anchor.transform.width / 2,
    }

    const dX = Math.cos(rayAngle)
    const dY = Math.sin(rayAngle)

    const hits = this.getHits(rayStart, dX, dY, gameObjects)
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

    const MIN_DIST = 0.5 // tune to your world units
    const correctedDistance = Math.max(
      hit.distance * Math.cos(rayAngle - this.anchor.transform.rotation),
      MIN_DIST,
    )

    const renderHeight =
      hit.object.transform.renderHeight ?? hit.object.transform.height
    const wallHeight =
      (renderHeight * this.projectionPlaneDistance) / correctedDistance

    return { distance: hit.distance, wallHeight, object: hit.object }
  }

  private getHits(
    rayStart: Vector2D,
    dX: number,
    dY: number,
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
          dX,
          dY,
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
    dX: number,
    dY: number,
    edgeStart: Vector2D,
    edgeEnd: Vector2D,
  ) {
    // calculate the distance to intersection point
    const ex = edgeEnd.x - edgeStart.x
    const ey = edgeEnd.y - edgeStart.y
    const den = ex * dY - ey * dX
    const erX = edgeStart.x - rayStart.x
    const erY = edgeStart.y - rayStart.y

    const uA = (ex * erY - ey * erX) / den
    const uB = (dX * erY - dY * erX) / den

    // // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uB >= 0 && uB <= 1) {
      return {
        distance: uA,
        x: rayStart.x + uA * dX,
        y: rayStart.y + uA * dY,
      }
    }

    return null
  }
}
