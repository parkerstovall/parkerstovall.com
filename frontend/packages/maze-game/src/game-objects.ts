import {
  Directions,
  Engine,
  GameObject,
  LAYERS,
  type Texture,
  type Transform,
} from '@parkerstovall.com/game-engine'

export class Player extends GameObject {
  public tags: string[] = []
  public zIndex: number = 10

  private speed: number = 75
  private speedAngle: number = 1.25
  private readonly targetX: number
  private readonly targetY: number

  constructor(
    engine: Engine,
    transform: Transform,
    layer: number,
    targetX: number,
    targetY: number,
  ) {
    super(engine, transform, layer)
    this.zIndex = 1
    this.collider = 'box'
    this.targetX = targetX
    this.targetY = targetY
    this.texture = {
      type: 'rectangle',
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
    }
  }

  earlyUpdate(): void {
    if (this.engine.keyStrokeManager.pressedKeys.has('a')) {
      this.move(Directions.LEFT, this.speed)
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('d')) {
      this.move(Directions.RIGHT, this.speed)
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('w')) {
      this.move(Directions.FORWARD, this.speed)
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('s')) {
      this.move(Directions.BACK, this.speed)
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('q')) {
      this.transform.rotation -= this.speedAngle * this.engine.deltaTime
    }

    if (this.engine.keyStrokeManager.pressedKeys.has('e')) {
      this.transform.rotation += this.speedAngle * this.engine.deltaTime
    }

    if (
      Math.abs(this.targetX - this.transform.x) < 40 &&
      Math.abs(this.targetY - this.transform.y) < 40
    ) {
      console.log('WIN')
    }
  }
}

export class Wall extends GameObject {
  public texture?: Texture = {
    type: 'rectangle',
    color: {
      r: 175,
      g: 175,
      b: 175,
    },
  }
}

export class Background extends GameObject {
  public texture?: Texture = {
    type: 'rectangle',
    color: {
      r: 136,
      g: 206,
      b: 235,
    },
  }

  constructor(engine: Engine, width: number, height: number) {
    super(
      engine,
      { x: 0, y: 0, width, height: height / 2, rotation: 0 },
      LAYERS.BACKGROUND_LAYER,
    )
  }
}

export class Foreground extends GameObject {
  public texture?: Texture = {
    type: 'rectangle',
    color: {
      r: 100,
      g: 100,
      b: 100,
    },
  }

  constructor(engine: Engine, width: number, height: number) {
    super(
      engine,
      { x: 0, y: height / 2, width, height: height / 2, rotation: 0 },
      LAYERS.BACKGROUND_LAYER,
    )
  }
}
