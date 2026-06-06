import { PacManMap } from 'pac-man-map-generator'
import { directions } from '../../constants'

export abstract class Character extends Phaser.Physics.Arcade.Sprite {
  position: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  gridPosition: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  direction: number = -1
  protected readonly gameMap: PacManMap
  protected abstract readonly speed: number

  protected textureMap: Record<number, string>

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    x: number,
    y: number,
    textureMap: Record<number, string>,
    texture: string,
    startingFrame?: string,
  ) {
    super(scene, x, y, texture, startingFrame)

    this.gameMap = gameMap
    this.position = { x, y }
    this.gridPosition = { x: Math.floor(x / 32), y: Math.floor(y / 32) }
    this.textureMap = textureMap

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(false)
  }

  update() {
    const cell = {
      x: Math.floor(this.x / 32),
      y: Math.floor(this.y / 32),
    }

    const center = {
      x: cell.x * 32 + 16,
      y: cell.y * 32 + 16,
    }

    const tolerance = 4
    const inCenterX = Math.abs(this.x - center.x) < tolerance
    const inCenterY = Math.abs(this.y - center.y) < tolerance

    // Snap to center if not already there
    if (
      (this.direction === directions.RIGHT ||
        this.direction === directions.LEFT) &&
      !inCenterY
    ) {
      this.setPosition(this.x, this.position.y)
    }

    if (
      (this.direction === directions.UP ||
        this.direction === directions.DOWN) &&
      !inCenterX
    ) {
      this.setPosition(this.position.x, this.y)
    }

    // At cell center
    if (inCenterX && inCenterY) {
      this.position = center
      this.gridPosition = cell

      // Teleporting logic
      if (cell.x < -1) {
        this.setPosition(32 * 28, this.y)
      } else if (cell.x > 27) {
        this.setPosition(-32, this.y)
      }

      if (
        !this.gameMap[cell.y]?.[cell.x] ||
        this.gameMap[cell.y]?.[cell.x]?.type === 'teleporter'
      ) {
        // Do nothing else if on a teleporter
        return
      }

      this.onCenter(cell)
    }
  }

  protected canMove(
    cell: { x: number; y: number },
    direction: number,
  ): boolean {
    const targetCell = { x: cell.x, y: cell.y }

    switch (direction) {
      case directions.LEFT:
        targetCell.x -= 1
        break
      case directions.RIGHT:
        targetCell.x += 1
        break
      case directions.UP:
        targetCell.y -= 1
        break
      case directions.DOWN:
        targetCell.y += 1
        break
      default:
        return false
    }

    // Always allow teleporting through left/right edges
    if (targetCell.x < 0 || targetCell.x > 27) {
      return true
    }

    const type = this.gameMap[targetCell.y]?.[targetCell.x]?.type
    return type === 'empty' || type === 'teleporter'
  }

  protected changeDirection(direction: number) {
    this.direction = direction
    switch (direction) {
      case directions.LEFT:
        this.setVelocity(-this.speed, 0)
        break
      case directions.RIGHT:
        this.setVelocity(this.speed, 0)
        break
      case directions.UP:
        this.setVelocity(0, -this.speed)
        break
      case directions.DOWN:
        this.setVelocity(0, this.speed)
        break
    }

    const tex = this.textureMap[direction]
    if (tex) {
      this.anims.stop()
      if (tex.startsWith('frame:')) {
        this.setFrame(tex.replace('frame:', ''))
      } else {
        this.anims.play(tex)
      }
    }
  }

  protected getOppositeDirection(direction: number): number {
    switch (direction) {
      case directions.LEFT:
        return directions.RIGHT
      case directions.RIGHT:
        return directions.LEFT
      case directions.UP:
        return directions.DOWN
      case directions.DOWN:
        return directions.UP
      default:
        return -1
    }
  }

  protected abstract onCenter(cell: Phaser.Types.Math.Vector2Like): void
  abstract handleDeath(): void
}
