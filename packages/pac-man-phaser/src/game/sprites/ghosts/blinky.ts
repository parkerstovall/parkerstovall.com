import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'
import { directions } from '../../constants'

export class Blinky extends Ghost {
  protected readonly pelletCountToLeaveHouse = 0
  protected readonly timerToLeaveHouse = 0 // milliseconds

  randomId = Math.random().toString(36).substring(2, 15)

  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 14 * 32
    const y = 11 * 32 + 16
    super(scene, gameMap, x, y, scatterTarget, pacman, 'blinky', [
      directions.UP,
      directions.RIGHT,
      directions.DOWN,
      directions.LEFT,
    ])

    this.setStartTimer()
    this.setFrame('blinky-left')
  }

  // Blinky always chases Pac-Man directly
  onCenter() {
    this.target = this.pacman.gridPosition
    super.onCenter()
  }
}
