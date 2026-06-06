import { PacManMap } from 'pac-man-map-generator'
import { Character } from '../characters/character'
import {
  directions,
  directionsArray,
  GHOST_SPEED,
  GHOST_SPEED_FRIGHTENED,
} from '../../constants'

export enum GhostState {
  CHASE,
  SCATTER,
  FRIGHTENED,
  DEAD,
}

export abstract class Ghost extends Character {
  ghostState: GhostState = GhostState.SCATTER
  protected pelletCount: number = 0
  protected speed: number = GHOST_SPEED
  protected readonly pacman: Character
  protected readonly gameMap: PacManMap
  protected readonly scatterTarget: Phaser.Types.Math.Vector2Like = {
    x: 0,
    y: 0,
  }
  protected target: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private previousGridCoords: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  protected abstract readonly pelletCountToLeaveHouse: number
  protected abstract readonly timerToLeaveHouse: number
  private hasLeftHouse: boolean = false
  private isLeavingHouse: boolean = false

  private sequenceIndex: number = 0
  private sequenceTimer?: Phaser.Time.TimerEvent
  private frightenedTimer?: Phaser.Time.TimerEvent
  private modeSequences = [
    { state: GhostState.SCATTER, duration: 5_000 },
    { state: GhostState.CHASE, duration: 20_000 },
    { state: GhostState.SCATTER, duration: 5_000 },
    { state: GhostState.CHASE, duration: 20000 },
    { state: GhostState.SCATTER, duration: 5_000 },
    { state: GhostState.CHASE, duration: 20_000 },
    { state: GhostState.SCATTER, duration: 5_000 },
    { state: GhostState.CHASE, duration: null }, // -1 means indefinite
  ]

  private readonly directionPriority: number[]

  private readonly defTextureMap
  private readonly startingCoords: Phaser.Types.Math.Vector2Like

  private frightenedTextureMap = {
    [directions.LEFT]: 'frame:frightened',
    [directions.RIGHT]: 'frame:frightened',
    [directions.UP]: 'frame:frightened',
    [directions.DOWN]: 'frame:frightened',
  }

  private frightenedEndTextureMap = {
    [directions.LEFT]: 'frightened-end',
    [directions.RIGHT]: 'frightened-end',
    [directions.UP]: 'frightened-end',
    [directions.DOWN]: 'frightened-end',
  }

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    scatterTarget: Phaser.Types.Math.Vector2Like,
    pacman: Character,
    ghostName: string,
    directionPriority: number[],
  ) {
    const startingFrame = `frame:${ghostName}-up`
    const textureMap = {
      [directions.LEFT]: `frame:${ghostName}-left`,
      [directions.RIGHT]: `frame:${ghostName}-right`,
      [directions.UP]: `frame:${ghostName}-up`,
      [directions.DOWN]: `frame:${ghostName}-down`,
    }

    super(scene, gameMap, x, y, textureMap, 'spritesheet', startingFrame)

    this.startingCoords = { x, y }
    this.directionPriority = directionPriority
    this.previousGridCoords = this.gridPosition
    this.defTextureMap = textureMap
    this.pacman = pacman
    this.gameMap = gameMap
    this.scatterTarget = scatterTarget
    this.frightenedTimer?.destroy()
    this.frightenedTimer = undefined
    this.sequenceTimer?.destroy()
    this.sequenceTimer = undefined
    this.sequenceIndex = 0

    this.target = this.scatterTarget
  }

  countPellet() {
    this.pelletCount++

    if (this.pelletCount === this.pelletCountToLeaveHouse) {
      this.leaveHouse()
    }
  }

  scare() {
    this.ghostState = GhostState.FRIGHTENED
    this.speed = GHOST_SPEED_FRIGHTENED
    let newDirection = this.getOppositeDirection(this.direction)
    const canMoveInOppositeDirection = this.canMove(
      this.gridPosition,
      newDirection,
    )

    if (!canMoveInOppositeDirection) {
      newDirection = this.getRandomDirection()
    }

    this.changeDirection(newDirection)
    this.textureMap = this.frightenedTextureMap
    this.setFrame('frightened')
    this.sequenceTimer?.destroy()

    // Clear existing timer and set new one
    this.frightenedTimer?.destroy()
    this.frightenedTimer = this.scene.time.delayedCall(6_000, () => {
      this.textureMap = this.frightenedEndTextureMap
      this.anims.play('frightened-end', true)
      this.frightenedTimer = this.scene.time.delayedCall(2_000, () => {
        this.speed = GHOST_SPEED
        this.textureMap = this.defTextureMap
        this.changeDirection(this.direction)
        this.startSequence()
      })
    })
  }

  private startSequence() {
    if (this.sequenceIndex >= this.modeSequences.length) {
      return
    }

    const sequence = this.modeSequences[this.sequenceIndex]
    this.ghostState = sequence.state

    if (sequence.duration !== null) {
      this.sequenceTimer = this.scene.time.delayedCall(
        sequence.duration,
        () => {
          this.sequenceIndex++
          this.startSequence()
        },
      )
    }
  }

  // Ghosts start moving after a delay
  protected setStartTimer() {
    this.scene.time.delayedCall(this.timerToLeaveHouse, () => {
      this.leaveHouse()
    })
  }

  private leaveHouse() {
    if (this.hasLeftHouse) {
      return
    }

    this.hasLeftHouse = true
    this.isLeavingHouse = true

    const x = 14 * 32
    const y = 11 * 32 + 16
    if (this.x <= x) {
      this.changeDirection(directions.RIGHT)
    } else if (this.x >= x) {
      this.changeDirection(directions.LEFT)
    } else if (this.y >= y) {
      this.changeDirection(directions.UP)
    } else {
      this.gridPosition = { x: 14, y: 11 }
      this.previousGridCoords = this.gridPosition
      this.mapPathToTarget(this.target)
      this.isLeavingHouse = false
      this.startSequence()
    }
  }

  update() {
    // If the ghost is still in the house, do nothing
    if (!this.hasLeftHouse) {
      return
    }

    if (this.isLeavingHouse) {
      const targetX = 14 * 32
      const targetY = 11 * 32 + 16
      if (this.direction === directions.UP && this.y <= targetY) {
        this.gridPosition = { x: 14, y: 11 }
        this.previousGridCoords = this.gridPosition
        this.isLeavingHouse = false
        this.setPosition(targetX, targetY)
        this.mapPathToTarget(this.target)
        this.startSequence()
      } else if (
        (this.direction === directions.RIGHT && this.x >= targetX) ||
        (this.direction === directions.LEFT && this.x <= targetX)
      ) {
        this.setPosition(targetX, this.y)
        this.changeDirection(directions.UP)
      }

      return
    }

    super.update()
  }

  onCenter() {
    const newCoords = this.gridPosition

    // Only recalculate path if the ghost has moved to a new grid square
    if (
      newCoords.x === this.previousGridCoords.x &&
      newCoords.y === this.previousGridCoords.y
    ) {
      return
    }

    this.previousGridCoords = newCoords

    if (this.direction === -1 || this.isAtIntersection()) {
      // Target for GhostState.CHASE is handled in subclasses
      switch (this.ghostState) {
        case GhostState.SCATTER:
          this.target = this.scatterTarget
          break
        case GhostState.FRIGHTENED:
          this.changeDirection(this.getRandomDirection())
          return
      }

      this.mapPathToTarget(this.target)
      return
    }

    this.checkForWall()
  }

  handleDeath() {
    if (this.body) {
      this.body.stop()
      this.body.enable = false
    }

    this.setAlpha(0)
    this.speed = 0
    this.ghostState = GhostState.DEAD
    this.scene.time.delayedCall(3000, () => {
      this.setAlpha(1)
      if (this.body) {
        this.body.enable = true
      }
      this.reset()
    })
  }

  private reset() {
    // Stop all timers
    this.frightenedTimer?.destroy()
    this.sequenceTimer?.destroy()

    // Reset state
    this.ghostState = GhostState.SCATTER
    this.speed = GHOST_SPEED
    this.hasLeftHouse = false
    this.isLeavingHouse = false
    this.textureMap = this.defTextureMap

    // Reset position to spawn
    this.setPosition(this.startingCoords.x, this.startingCoords.y)
    this.gridPosition = {
      x: Math.floor(this.startingCoords.x / 32),
      y: Math.floor(this.startingCoords.y / 32),
    }
    this.previousGridCoords = this.gridPosition
    this.direction = -1

    // Restart house timer
    this.setStartTimer()
  }

  private getRandomDirection(): number {
    const possibleDirections = directionsArray.filter(
      (d) => d.dir !== this.getOppositeDirection(this.direction),
    )

    const validDirections = possibleDirections.filter((d) => {
      const newX = this.previousGridCoords.x + d.x
      const newY = this.previousGridCoords.y + d.y
      return (
        this.gameMap[newY]?.[newX]?.type !== 'wall' &&
        this.gameMap[newY]?.[newX]?.type !== 'ghost-house'
      )
    })

    if (validDirections.length === 0) {
      return this.getOppositeDirection(this.direction)
    }

    return Phaser.Utils.Array.GetRandom(validDirections).dir
  }

  private mapPathToTarget(target: Phaser.Types.Math.Vector2Like) {
    // Calculate the shortest distance from
    // each surrounding square to the target
    // excluding the back wards direction
    const directionsToCheck = this.directionPriority
      .filter((d) => d !== this.getOppositeDirection(this.direction))
      .map((dir) => {
        return directionsArray.find((d) => d.dir === dir)
      })
      .filter((d) => d !== undefined)

    let shortestDistance = Infinity
    let bestDirection = this.direction

    directionsToCheck.forEach((d) => {
      const newX = this.gridPosition.x + d.x
      const newY = this.gridPosition.y + d.y
      const block = this.gameMap[newY]?.[newX]

      if (
        block &&
        this.gameMap[newY]?.[newX]?.type !== 'wall' &&
        this.gameMap[newY]?.[newX]?.type !== 'ghost-house'
      ) {
        const distance = Math.hypot(target.x - newX, target.y - newY)
        if (distance < shortestDistance) {
          shortestDistance = distance
          bestDirection = d.dir
        } else if (
          distance === shortestDistance &&
          bestDirection === this.direction
        ) {
          // If distances are equal, prefer to keep moving in the same direction
          bestDirection = d.dir
        }
      }
    })

    // Move in the best direction
    this.changeDirection(bestDirection)
  }

  private isAtIntersection(): boolean {
    const cell = {
      x: Math.floor(this.position.x / 32),
      y: Math.floor(this.position.y / 32),
    }

    let paths = 0
    directionsArray.forEach((dir) => {
      const newX = cell.x + dir.x
      const newY = cell.y + dir.y

      if (
        this.gameMap[newY]?.[newX]?.type !== 'wall' &&
        this.gameMap[newY]?.[newX]?.type !== 'ghost-house'
      ) {
        paths++
      }
    })

    return paths > 2
  }

  private checkForWall() {
    if (!this.canMove(this.previousGridCoords, this.direction)) {
      this.mapPathToTarget(this.target)
    }
  }

  static loadTextures(textures: Phaser.Textures.TextureManager) {
    const tex = textures.get('spritesheet')

    const ghosts = ['blinky', 'pinky', 'inky', 'clyde', 'eyes']
    const spriteMaps = []
    for (let i = 0; i < ghosts.length; i++) {
      const ghost = ghosts[i]
      spriteMaps.push(
        { key: `${ghost}-up`, xPos: i * 2, yPos: 4 },
        { key: `${ghost}-down`, xPos: i * 2, yPos: 6 },
        { key: `${ghost}-left`, xPos: i * 2, yPos: 8 },
        { key: `${ghost}-right`, xPos: i * 2, yPos: 10 },
      )
    }

    spriteMaps.push({ key: `frightened`, xPos: 10, yPos: 4 })
    spriteMaps.push({ key: `frightened-flash`, xPos: 10, yPos: 6 })

    for (let i = 0; i < spriteMaps.length; i++) {
      const { key, xPos, yPos } = spriteMaps[i]
      tex.add(key, 0, xPos * 16, yPos * 16, 32, 32)
    }
  }

  static loadAnimations(anims: Phaser.Animations.AnimationManager) {
    anims.create({
      key: 'frightened-end',
      frames: [
        { key: 'spritesheet', frame: 'frightened-flash' },
        { key: 'spritesheet', frame: 'frightened' },
      ],
      repeat: -1,
      frameRate: 5,
    })
  }
}
