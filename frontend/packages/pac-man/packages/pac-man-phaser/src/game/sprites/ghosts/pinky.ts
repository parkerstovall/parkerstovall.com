import { PacManMap } from 'pac-man-map-generator'
import { Ghost } from './ghost'
import { Character } from '../characters/character'
import { directions } from '../../constants'

export class Pinky extends Ghost {
  protected readonly pelletCountToLeaveHouse = 0
  protected readonly timerToLeaveHouse = 0 // milliseconds
  constructor(
    scene: Phaser.Scene,
    gameMap: PacManMap,
    pacman: Character,
    scatterTarget: Phaser.Types.Math.Vector2Like,
  ) {
    const x = 14 * 32
    const y = 13.5 * 32
    super(scene, gameMap, x, y, scatterTarget, pacman, 'pinky', [
      directions.UP,
      directions.LEFT,
      directions.DOWN,
      directions.RIGHT,
    ])

    this.setFrame('pinky-up')
    this.setStartTimer()
  }

  // Pinky tries to position itself 4 tiles ahead of Pac-Man
  onCenter() {
    this.target = this.pacman.gridPosition

    switch (this.pacman.direction) {
      case directions.LEFT:
        this.target.x -= 4
        break
      case directions.UP:
        // The original Pac-Man had a bug
        // where if Pac-Man was facing up,
        // then Pinky actually targeted 4 tiles up and 4 tiles left
        this.target.y -= 4
        this.target.x -= 4
        break
      case directions.RIGHT:
        this.target.x += 4
        break
      case directions.DOWN:
        this.target.y += 4
        break
    }

    super.onCenter()
  }
}
