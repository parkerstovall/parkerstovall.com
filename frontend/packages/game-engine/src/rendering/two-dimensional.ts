import type { Engine } from '../engine'
import type { GameObject, Transform } from '../interfaces'
import { Camera } from './camera'

export class TwoDimensionalCamera extends Camera {
  private readonly backgroundLayer: HTMLCanvasElement
  private readonly gameLayer: HTMLCanvasElement
  private readonly uiLayer: HTMLCanvasElement
  private readonly width: number
  private readonly height: number

  private readonly backgroundLayerTag = 'background-layer'
  private readonly gameLayerTag = 'game-layer'
  private readonly uiLayerTag = 'ui-layer'

  private readonly anchor?: GameObject
  private offsetX: number = 0
  private offsetY: number = 0

  constructor(
    engine: Engine,
    position: Transform,
    width: number,
    height: number,
    parentId: string,
    anchor?: GameObject,
  ) {
    super(engine, position, parentId)

    this.width = width
    this.height = height
    this.parent.style.width = width + 'px'
    this.parent.style.height = height + 'px'
    this.parent.style.position = 'relative'
    this.anchor = anchor
    console.log(this.anchor)
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
      console.log(this.offsetX, this.offsetY)
    }
  }

  paint(gameObjects: GameObject[]) {
    const objectsToPaint = gameObjects.filter((g) => this.shouldPaint(g))
    const bgCtx = this.backgroundLayer.getContext('2d')!
    const gameCtx = this.gameLayer.getContext('2d')!
    const uiCtx = this.uiLayer.getContext('2d')!
    bgCtx.clearRect(0, 0, this.width, this.height)
    gameCtx.clearRect(0, 0, this.width, this.height)
    uiCtx.clearRect(0, 0, this.width, this.height)

    for (const object of objectsToPaint) {
      let ctx: CanvasRenderingContext2D
      if (object.tags.includes(this.backgroundLayerTag)) {
        ctx = bgCtx
      } else if (object.tags.includes(this.uiLayerTag)) {
        ctx = uiCtx
      } else {
        ctx = gameCtx
      }

      const texture = object.texture!
      const { x, y, width, height } = object.transform
      const drawX = x - this.offsetX
      const drawY = y - this.offsetY

      switch (texture.type) {
        case 'rectangle':
          ctx.fillStyle = texture.color
          ctx.fillRect(drawX, drawY, width, height)
          break
        case 'circle':
          const centerX = drawX + width / 2
          const centerY = drawY + height / 2
          ctx.fillStyle = texture.color
          ctx.beginPath()
          ctx.arc(centerX, centerY, width / 2, 0, 2 * Math.PI)
          ctx.fill()
          break
        case 'image':
          ctx.drawImage(texture.image, drawX, drawY, width, height)
      }
    }
  }

  private shouldPaint(gameObject: GameObject) {
    if (!gameObject.texture) {
      return false
    }

    if (
      !gameObject.tags.some((t) =>
        [this.backgroundLayerTag, this.gameLayerTag, this.uiLayerTag].includes(
          t,
        ),
      )
    ) {
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
