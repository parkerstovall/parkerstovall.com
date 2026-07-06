import {
  Engine,
  GameObject,
  LAYERS,
  Player,
  type LAYER_KEYS,
  type Texture,
  type Transform,
} from '@parkerstovall.com/game-engine'

export class MazePlayer extends Player {
  public tags: string[] = []
  public zIndex: number = 10
  private readonly targetX: number
  private readonly targetY: number

  constructor(
    engine: Engine,
    transform: Transform,
    layer: LAYER_KEYS,
    targetX: number,
    targetY: number,
  ) {
    super(engine, transform, layer, 50, 1)
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
    super.earlyUpdate()
    if (
      Math.abs(this.targetX - this.transform.x) < 40 &&
      Math.abs(this.targetY - this.transform.y) < 40
    ) {
      console.log('WIN')
    }
  }
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class Wall extends GameObject {
  public static: boolean = true
  public texture?: Texture = {
    type: 'rectangle',
    color: {
      r: randomInt(0, 255),
      g: randomInt(0, 255),
      b: randomInt(0, 255),
    },
  }

  constructor(engine: Engine, transform: Transform, layer: LAYER_KEYS) {
    super(engine, transform, layer)
    this.collider = 'box'
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
