import type { Engine } from '../engine'
import type { GameObject, Position } from '../interfaces'
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

  constructor(
    engine: Engine,
    position: Position,
    width: number,
    height: number,
    parentId: string,
  ) {
    super(engine, position, parentId)

    this.width = width
    this.height = height
    this.parent.style.width = width + 'px'
    this.parent.style.height = height + 'px'
    this.parent.style.position = 'relative'

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

  paint(gameObjects: GameObject[]) {
    const objectsToPaint = gameObjects.filter((g) => this.shouldPaint(g))
    const bgCtx = this.backgroundLayer.getContext('2d')!
    const gameCtx = this.gameLayer.getContext('2d')!
    const uiCtx = this.uiLayer.getContext('2d')!

    for (const object of objectsToPaint) {
      console.log('Drawing object')
      let ctx: CanvasRenderingContext2D
      if (object.tags.includes(this.backgroundLayerTag)) {
        ctx = bgCtx
      } else if (object.tags.includes(this.uiLayerTag)) {
        ctx = uiCtx
      } else {
        ctx = gameCtx
      }

      const texture = object.texture!
      const { x, y } = object.position

      switch (texture.type) {
        case 'rectangle':
          ctx.fillStyle = texture.color
          ctx.fillRect(x, y, texture.width, texture.height)
          break
        case 'circle':
          const centerX = x + texture.width / 2
          const centerY = y + texture.height / 2
          ctx.fillStyle = texture.color
          ctx.beginPath()
          ctx.arc(centerX, centerY, texture.width / 2, 0, 2 * Math.PI)
          ctx.fill()
          break
        case 'image':
          ctx.drawImage(texture.image, x, y, texture.width, texture.height)
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

    const { x, y } = gameObject.position
    if (x > this.width) {
      return false
    }

    if (y > this.height) {
      return false
    }

    if (x + gameObject.texture.width < 0) {
      return false
    }

    if (y + gameObject.texture.height < 0) {
      return false
    }

    return true
  }
}
