import { GAME_LAYER } from './constants'
import { Engine } from './engine'
import {
  GameObject,
  type Transform,
  type Collider,
  type Scene,
  type Sprite,
} from './interfaces'
import { TwoDimensionalCamera } from './rendering/two-dimensional'

class DevObject extends GameObject {
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
    super(engine, transform, layer)
    this.texture = {
      type: 'rectangle',
      color,
    }
  }
}

class DevSquare extends GameObject {
  public collider: Collider = {
    type: 'box',
  }

  public tags: string[] = []

  private speedX: number = 125
  private speedY: number = 125
  private speedAngle: number = 0.35
  private readonly text: Sprite

  constructor(
    engine: Engine,
    transform: Transform,
    layer: string,
    color: string,
  ) {
    super(engine, transform, layer)
    this.texture = {
      type: 'rectangle',
      color,
    }
    this.text = this.texture
    this.zIndex = 1
  }

  earlyUpdate(): void {
    if (this.engine.keyStrokeManager.pressedKeys.has('a')) {
      this.transform.x -= this.speedX * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('d')) {
      this.transform.x += this.speedX * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('w')) {
      this.transform.y -= this.speedY * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('s')) {
      this.transform.y += this.speedY * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('q')) {
      this.transform.rotation -= this.speedAngle * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('e')) {
      this.transform.rotation += this.speedAngle * this.engine.deltaTime
    }
  }

  onCollisionEnter?(gameObject: GameObject) {
    console.log(
      `I ${this.text?.color} collided with ${(gameObject.texture as Sprite)?.color}`,
    )
  }

  onCollisionExit?(gameObject: GameObject) {
    console.log(
      `I ${this.text?.color} am no longer colliding with ${(gameObject.texture as Sprite)?.color}`,
    )
  }
}

const devScene: Scene = {
  name: 'Dev Scene',
  load: (engine) => {
    const blue = engine.addPlayer(
      new DevSquare(
        engine,
        { x: 100, y: 50, height: 50, width: 50, rotation: 0 },
        GAME_LAYER,
        'blue',
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 0,
          y: 0,
          width: 25,
          height: 25,
          rotation: 0,
        },
        GAME_LAYER,
        'green',
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 100,
          y: 0,
          width: 25,
          height: 25,
          rotation: 0,
        },
        GAME_LAYER,
        'yellow',
      ),
    )

    engine.addCamera(
      new TwoDimensionalCamera(
        engine,
        {
          x: 100,
          y: 50,
          height: 50,
          width: 50,
          rotation: 0,
        },
        250,
        250,
        'game',
        blue,
      ),
    )
  },
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine()
  engine.setScene(devScene)
})
