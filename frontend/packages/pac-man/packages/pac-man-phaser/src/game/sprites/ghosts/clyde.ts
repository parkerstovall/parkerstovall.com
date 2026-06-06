import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'
import { directions } from '../../constants'

export class Clyde extends Ghost {
  protected readonly pelletCountToLeaveHouse = 60
  protected readonly timerToLeaveHouse = 11_000 // milliseconds

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 15.25 * 32
    const y = 13.5 * 32
    super(scene, gameMap, x, y, scatterTarget, pacman, 'clyde', [
      directions.DOWN,
      directions.LEFT,
      directions.UP,
      directions.RIGHT,
    ])
    this.setFrame('clyde-left')
    this.setStartTimer()
  }

  // Clyde always chases Pac-Man directly
  // However, if he gets within 8 tiles of Pac-Man, he will stop moving toward him
  // and instead target his "home" position in the bottom-left corner of the map
  onCenter() {
    this.target = this.pacman.gridPosition
    const distance =
      Math.abs(this.gridPosition.x - this.pacman.gridPosition.x) +
      Math.abs(this.gridPosition.y - this.pacman.gridPosition.y)
    if (distance < 8) {
      this.target = this.scatterTarget
    }

    super.onCenter()
  }
}
