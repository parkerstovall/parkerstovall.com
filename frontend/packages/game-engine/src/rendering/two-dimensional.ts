import { LAYERS } from '../constants'
import type { Engine } from '../engine'
import type { GameObject } from '../game-object'
import type { Transform } from '../types'
import { Camera } from './camera'

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
    canvas.style.width = '100%'
    canvas.style.height = '100%'
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
      'ZIndex:ThisShouldPaint',
      (gameObjects) =>
        [...gameObjects]
          .sort((a, b) => a.zIndex - b.zIndex)
          .filter((o) => this.shouldPaint(o)),
    )

    const bgCtx = this.backgroundLayer.getContext('2d')!
    const gameCtx = this.gameLayer.getContext('2d')!
    const uiCtx = this.uiLayer.getContext('2d')!
    bgCtx.clearRect(0, 0, this.width, this.height)
    gameCtx.clearRect(0, 0, this.width, this.height)
    uiCtx.clearRect(0, 0, this.width, this.height)

    for (const object of objects) {
      if (object.layer === LAYERS.BACKGROUND_LAYER) {
        object.texture?.paint2d?.(bgCtx)
      } else if (object.layer === LAYERS.UI_LAYER) {
        object.texture?.paint2d?.(uiCtx)
      } else if (object.layer === LAYERS.GAME_LAYER) {
        object.texture?.paint2d?.(gameCtx, this.offsetX, this.offsetY)
      }
    }
  }

  private shouldPaint(gameObject: GameObject) {
    if (!gameObject.texture) {
      return false
    }

    if (gameObject.layer !== LAYERS.GAME_LAYER) {
      return true
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

  destroy() {
    this.backgroundLayer.remove()
    this.gameLayer.remove()
    this.uiLayer.remove()
  }
}
