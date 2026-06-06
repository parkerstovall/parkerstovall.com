import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'
import { directions } from '../../constants'

export class Inky extends Ghost {
  protected readonly pelletCountToLeaveHouse = 30
  protected readonly timerToLeaveHouse = 5000 // milliseconds
  private readonly blinky: Character
  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    blinky: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 12.75 * 32
    const y = 13.5 * 32
    super(scene, gameMap, x, y, scatterTarget, pacman, 'inky', [
      directions.RIGHT,
      directions.DOWN,
      directions.LEFT,
      directions.UP,
    ])
    this.blinky = blinky
    this.setFrame('inky-right')
    this.setStartTimer()
  }

  // Inky tries to position itself based on both Blinky's and Pac-Man's positions
  // First, it picks a tile two spaces in front of Pac-Man
  // Then, it draws a vector from Blinky to that tile and doubles it
  // Inky then targets the end of that new vector
  onCenter() {
    this.target = this.pacman.gridPosition
    switch (this.pacman.direction) {
      case directions.LEFT:
        this.target.x -= 2
        break
      case directions.UP:
        // The original Pac-Man had a bug
        // where if Pac-Man was facing up,
        // then Inky actually targeted 2 tiles up and 2 tiles left
        this.target.x -= 2
        this.target.y -= 2
        break
      case directions.RIGHT:
        this.target.x += 2
        break
      case directions.DOWN:
        this.target.y += 2
        break
    }

    const vectorX = (this.target.x - this.blinky.gridPosition.x) * 2
    const vectorY = (this.target.y - this.blinky.gridPosition.y) * 2

    this.target.x += vectorX
    this.target.y += vectorY

    super.onCenter()
  }
}
