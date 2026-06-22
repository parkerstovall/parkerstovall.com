import { CACHE_NAMES, LAYERS } from '../constants'
import type { Engine } from '../engine'
import type { GameObject, Transform } from '../types'
import { Camera } from './camera'
import { getRGB } from './textures'

export class TwoDimensionalCamera extends Camera {
  private readonly backgroundLayer: HTMLCanvasElement
  private readonly gameLayer: HTMLCanvasElement
  private readonly uiLayer: HTMLCanvasElement
  private readonly width: number
  private readonly height: number

  private readonly anchor?: GameObject
  private offsetX: number = 0
  private offsetY: number = 0

  constructor(
    engine: Engine,
    position: Transform,
    layer: number,
    width: number,
    height: number,
    parentId: string,
    anchor?: GameObject,
  ) {
    super(engine, position, layer, parentId)

    this.width = width
    this.height = height
    this.parent.style.width = width + 'px'
    this.parent.style.height = height + 'px'
    this.parent.style.position = 'relative'
    this.anchor = anchor
    if (this.anchor) {
      this.offsetX = this.anchor.transform.x - this.transform.x
      this.offsetY = this.anchor.transform.y - this.transform.y
    }

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

  lateUpdate(): void {
    if (this.anchor) {
      this.offsetX = this.anchor.transform.x - this.transform.x
      this.offsetY = this.anchor.transform.y - this.transform.y
    }
  }

  paint() {
    const objects = this.engine.getGameObjects(
      CACHE_NAMES.Z_INDEX_SORT,
      (gameObjects) => [...gameObjects].sort((a, b) => a.zIndex - b.zIndex),
    )

    const bgCtx = this.backgroundLayer.getContext('2d')!
    const gameCtx = this.gameLayer.getContext('2d')!
    const uiCtx = this.uiLayer.getContext('2d')!
    bgCtx.clearRect(0, 0, this.width, this.height)
    gameCtx.clearRect(0, 0, this.width, this.height)
    uiCtx.clearRect(0, 0, this.width, this.height)

    for (const object of objects) {
      if (!this.shouldPaint(object)) {
        continue
      }

      let ctx: CanvasRenderingContext2D
      if (object.layer === LAYERS.BACKGROUND_LAYER) {
        ctx = bgCtx
      } else if (object.layer === LAYERS.UI_LAYER) {
        ctx = uiCtx
      } else if (object.layer === LAYERS.GAME_LAYER) {
        ctx = gameCtx
      } else {
        continue
      }

      const texture = object.texture!
      const { x, y, width, height, rotation } = object.transform
      const drawX = x - this.offsetX
      const drawY = y - this.offsetY

      if (rotation) {
        ctx.save()
        const centerX = drawX + width / 2
        const centerY = drawY + height / 2
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)
        ctx.translate(-centerX, -centerY)
      }

      switch (texture.type) {
        case 'rectangle':
          ctx.fillStyle = getRGB(texture.color)
          ctx.fillRect(drawX, drawY, width, height)
          break
        case 'circle':
          const centerX = drawX + width / 2
          const centerY = drawY + height / 2
          ctx.fillStyle = getRGB(texture.color)
          ctx.beginPath()
          ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI)
          ctx.fill()
          break
        case 'image':
          ctx.drawImage(texture.image, drawX, drawY, width, height)
      }

      if (rotation) {
        ctx.restore()
      }
    }
  }

  private shouldPaint(gameObject: GameObject) {
    if (!gameObject.texture) {
      return false
    }

    const { x, y, height, width } = gameObject.transform
    if (x - this.offsetX > this.width) {
      return false
    }

    if (y - this.offsetY > this.height) {
      return false
    }

    if (x + width - this.offsetX < 0) {
      return false
    }

    if (y + height - this.offsetY < 0) {
      return false
    }

    return true
  }
}
