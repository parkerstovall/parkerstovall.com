import {
  Directions,
  Engine,
  GameObject,
  LAYERS,
  Player,
  RectangleSprite,
  TextObject,
  WHITE,
  type Collider,
  type CollisionInfo,
  type Color,
  type Direction,
  type Texture,
  type Transform,
  type Vector2D,
} from '@parkerstovall.com/game-engine'
import { BLOCK_SIZE, ENEMY_SIZE, GAME_HEIGHT, GAME_WIDTH } from './constants'
import {
  type Block,
  type PacManMap,
} from '@parkerstovall.com/pac-man-map-generator'

export class MazePlayer extends Player {
  public collider: Collider = 'box'
  public texture: Texture = new RectangleSprite(this, {
    r: 0,
    g: 0,
    b: 0,
  })

  private readonly targetX: number
  private readonly targetY: number
  private didEndGame = false

  constructor(
    engine: Engine,
    transform: Transform,
    targetX: number,
    targetY: number,
  ) {
    super(engine, transform, LAYERS.GAME_LAYER, 50, 1)
    this.zIndex = 1
    this.targetX = targetX
    this.targetY = targetY
  }

  private onWin() {
    if (this.didEndGame) {
      return
    }

    this.didEndGame = true

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

  private onDeath() {
    if (this.didEndGame) {
      return
    }

    this.didEndGame = true

    this.engine.addObject(
      new Foreground(this.engine, {
        r: 255,
        g: 0,
        b: 0,
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
        'You died! (r to restart)',
        WHITE,
        'center',
      ),
    )

    if (!this.engine.isPaused) {
      this.engine.togglePause()
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCollisionEnter(gameObject: GameObject, _collision: CollisionInfo): void {
    if (gameObject.tags.includes('enemy')) {
      this.onDeath()
    }
  }
}

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class Wall extends GameObject {
  public static: boolean = true
  public collider: Collider = 'box'
  public texture: Texture = new RectangleSprite(this, {
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255),
  })

  public tags = ['wall']
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

type Neighbor = {
  block: Block
  direction: Direction
}

export class Enemy extends GameObject {
  public collider: Collider = 'box'
  public texture?: Texture = new RectangleSprite(this, {
    r: 0,
    g: 0,
    b: 0,
  })

  private readonly speed = 35
  private readonly player: GameObject
  private readonly map: PacManMap
  private pos: Vector2D
  private currentDirection: Direction | null = null

  constructor(
    engine: Engine,
    position: Transform,
    player: GameObject,
    map: PacManMap,
  ) {
    super(engine, position, LAYERS.GAME_LAYER)
    this.map = map
    this.player = player
    this.tags.push('enemy')

    this.pos = {
      x: Math.floor(this.transform.x / BLOCK_SIZE),
      y: Math.floor(this.transform.y / BLOCK_SIZE),
    }
  }

  update() {
    this.checkPos()
    const neighbors = this.getEmptyNeighbors()
    if (this.currentDirection === null || neighbors.length > 2) {
      const newDir = this.getNextDir(neighbors)

      if (this.currentDirection !== newDir && newDir !== this.reverseDir()) {
        this.currentDirection = newDir
        this.transform.x = this.pos.x * BLOCK_SIZE + ENEMY_SIZE / 2
        this.transform.y = this.pos.y * BLOCK_SIZE + ENEMY_SIZE / 2
      }
    }

    if (this.currentDirection !== null) {
      this.move(this.currentDirection, this.speed)
    }
  }

  private reverseDir() {
    switch (this.currentDirection) {
      case Directions.LEFT:
        return Directions.RIGHT
      case Directions.RIGHT:
        return Directions.LEFT
      case Directions.BACK:
        return Directions.FORWARD
      case Directions.FORWARD:
        return Directions.BACK
    }
  }

  private checkPos() {
    const newPos = {
      x: Math.floor((this.transform.x + ENEMY_SIZE / 2) / BLOCK_SIZE),
      y: Math.floor((this.transform.y + ENEMY_SIZE / 2) / BLOCK_SIZE),
    }

    if (newPos.x !== this.pos.x || newPos.y !== this.pos.y) {
      this.pos = newPos
    }

    let checkX = this.pos.x
    let checkY = this.pos.y
    switch (this.currentDirection) {
      case Directions.LEFT:
        checkY--
        break
      case Directions.RIGHT:
        checkY++
        break
      case Directions.BACK:
        checkX--
        break
      case Directions.FORWARD:
        checkX++
        break
    }

    if (this.map[checkY]?.[checkX]?.type !== 'empty') {
      this.currentDirection = null
    }
  }

  private getPointDistance(pa: Vector2D, pb: Vector2D) {
    return Math.sqrt(Math.pow(pb.x - pa.x, 2) + Math.pow(pb.y - pa.y, 2))
  }

  private getNextDir(neighbors: Neighbor[]) {
    let minDistance = Infinity
    let nextDir: Direction = this.currentDirection ?? Directions.LEFT
    for (const neighbor of neighbors) {
      const nPos = {
        x: neighbor.block.position.x * BLOCK_SIZE,
        y: neighbor.block.position.y * BLOCK_SIZE,
      }

      const dist = this.getPointDistance(this.player.transform, nPos)
      if (dist < minDistance) {
        minDistance = dist
        nextDir = neighbor.direction
      }
    }

    return nextDir
  }

  private getEmptyNeighbors() {
    const modX = [-1, 0, 1, 0]
    const modY = [0, -1, 0, 1]

    const neighbors: Neighbor[] = []

    for (let i = 0; i < 4; i++) {
      const x = this.pos.x + modX[i]
      const y = this.pos.y + modY[i]
      const block = this.map[y]?.[x]
      if (!block) {
        continue
      }

      if (block.type === 'empty') {
        if (i === 0) {
          neighbors.push({ block, direction: Directions.BACK })
        } else if (i === 1) {
          neighbors.push({ block, direction: Directions.LEFT })
        } else if (i === 2) {
          neighbors.push({ block, direction: Directions.FORWARD })
        } else if (i === 3) {
          neighbors.push({ block, direction: Directions.RIGHT })
        }
      }
    }

    return neighbors
  }
}
