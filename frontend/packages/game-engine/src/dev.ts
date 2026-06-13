import { Engine } from './engine'
import {
  GameObject,
  type Transform,
  type Collider,
  type Scene,
} from './interfaces'
import { TwoDimensionalCamera } from './rendering/two-dimensional'

class DevSquare extends GameObject {
  public collider: Collider = {
    type: 'box',
  }

  public tags: string[] = []

  constructor(
    engine: Engine,
    transform: Transform,
    layer: string,
    color: string,
  ) {
    super(engine, transform)
    this.tags.push(layer)
    this.texture = {
      type: 'rectangle',
      color,
    }

    if (this.texture.color === 'blue') {
      this.engine.keyStrokeManager.addKeyEvent('down', 'a', () => {
        console.log('down')
        this.transform.x -= 5
      })
    } else if (this.texture.color === 'yellow') {
      this.engine.keyStrokeManager.addKeyEvent('down', 'd', () => {
        this.transform.x += 5
      })
    }
  }

  // start() {
  //   console.log('started', this.objectId, this.texture)
  // }

  // earlyUpdate(): void {
  //   console.log('early update', this.objectId)
  // }

  // update() {
  //   console.log('update', this.objectId)
  // }

  // lateUpdate(): void {
  //   console.log('late update', this.objectId)
  // }
}

const devScene: Scene = {
  name: 'Dev Scene',
  load: (engine) => {
    const blue = engine.addPlayer(
      new DevSquare(
        engine,
        { x: 50, y: 50, height: 50, width: 50 },
        'game-layer',
        'blue',
      ),
    )

    engine.addPlayer(
      new DevSquare(
        engine,
        { x: 25, y: 50, height: 50, width: 50 },
        'background-layer',
        'green',
      ),
    )

    const yellow = engine.addPlayer(
      new DevSquare(
        engine,
        { x: 75, y: 50, height: 50, width: 50 },
        'ui-layer',
        'yellow',
      ),
    )

    engine.addCamera(
      new TwoDimensionalCamera(
        engine,
        {
          x: 50,
          y: 50,
          height: 50,
          width: 50,
        },
        250,
        250,
        'game',
        blue,
      ),
    )

    engine.addCamera(
      new TwoDimensionalCamera(
        engine,
        {
          x: 50,
          y: 50,
          height: 50,
          width: 50,
        },
        250,
        250,
        'game-2',
        yellow,
      ),
    )
  },
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine()
  engine.setScene(devScene)
})
