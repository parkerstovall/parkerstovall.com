import {
  Engine,
  GameObject,
  LAYERS,
  Player,
  RectangleSprite,
  TextObject,
  WHITE,
  type Color,
  type LAYER_KEYS,
  type Texture,
  type Transform,
} from '@parkerstovall.com/game-engine'
import { BLOCK_SIZE, GAME_HEIGHT, GAME_WIDTH } from './constants'

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
    this.texture = new RectangleSprite(this, {
      r: 0,
      g: 0,
      b: 0,
    })
  }

  private onWin() {
    this.engine.addObject(
      new Foreground(this.engine, {
        r: 100,
        g: 255,
        b: 100,
        a: 0.6,
      }),
    )

    this.engine.addObject(
      new TextObject(
        this.engine,
        {
          x: GAME_WIDTH / 2 - 150,
          y: GAME_HEIGHT / 2 - 24,
          width: 300,
          height: -1,
          rotation: 0,
        },
        'You win! (r to restart)',
        WHITE,
        'center',
      ),
    )

    this.engine.togglePause()
  }

  earlyUpdate(): void {
    super.earlyUpdate()
    if (
      Math.abs(this.targetX - this.transform.x) < BLOCK_SIZE / 2 &&
      Math.abs(this.targetY - this.transform.y) < BLOCK_SIZE / 2
    ) {
      this.onWin()
    }
  }
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class Wall extends GameObject {
  public static: boolean = true
  public texture?: Texture = new RectangleSprite(this, {
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255),
  })

  constructor(engine: Engine, transform: Transform, layer: LAYER_KEYS) {
    super(engine, transform, layer)
    this.collider = 'box'
  }
}

export class Foreground extends GameObject {
  public static: boolean = true

  constructor(engine: Engine, color: Color) {
    super(
      engine,
      { x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT, rotation: 0 },
      LAYERS.UI_LAYER,
    )

    this.texture = new RectangleSprite(this, color)
  }
}

export class Background extends GameObject {
  public static: boolean = true
  public texture?: Texture = new RectangleSprite(this, {
    r: 136,
    g: 206,
    b: 235,
  })

  constructor(engine: Engine, width: number, height: number) {
    super(
      engine,
      { x: 0, y: 0, width, height: height / 2, rotation: 0 },
      LAYERS.BACKGROUND_LAYER,
    )
  }
}

export class SecondBackground extends GameObject {
  public texture?: Texture = new RectangleSprite(this, {
    r: 100,
    g: 100,
    b: 100,
  })

  constructor(engine: Engine, width: number, height: number) {
    super(
      engine,
      { x: 0, y: height / 2, width, height: height / 2, rotation: 0 },
      LAYERS.BACKGROUND_LAYER,
    )
  }
}
