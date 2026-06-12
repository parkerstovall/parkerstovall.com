import { Engine } from './engine'
import {
  GameObject,
  type Position,
  type RectangleCollider,
  type Scene,
} from './interfaces'
import { TwoDimensionalCamera } from './rendering/two-dimensional'

class DevSquare extends GameObject {
  public collider: RectangleCollider = {
    type: 'rect',
    width: 50,
    height: 50,
  }

  public tags: string[] = []

  constructor(
    engine: Engine,
    position: Position,
    layer: string,
    color: string,
  ) {
    super(engine, position)
    this.tags.push(layer)
    this.texture = {
      type: 'rectangle',
      width: 50,
      height: 50,
      color,
    }
  }

  start() {
    console.log('started', this.objectId, this.texture)
  }

  earlyUpdate(): void {
    console.log('early update', this.objectId)
  }

  update() {
    console.log('update', this.objectId)
  }

  lateUpdate(): void {
    console.log('late update', this.objectId)
  }
}

const devScene: Scene = {
  name: 'Dev Scene',
  load: (engine) => {
    engine.addPlayer(
      new DevSquare(engine, { x: 50, y: 50 }, 'game-layer', 'blue'),
    )
    engine.addPlayer(
      new DevSquare(engine, { x: 25, y: 50 }, 'background-layer', 'green'),
    )
    engine.addPlayer(
      new DevSquare(engine, { x: 75, y: 50 }, 'ui-layer', 'yellow'),
    )
    engine.addCamera(
      new TwoDimensionalCamera(
        engine,
        {
          x: 50,
          y: 50,
        },
        250,
        250,
        'game',
      ),
    )
  },
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine()
  engine.setScene(devScene)
})
