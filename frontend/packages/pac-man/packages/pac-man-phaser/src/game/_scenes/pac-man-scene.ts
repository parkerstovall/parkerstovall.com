import { Scene } from 'phaser'
import { Wall } from '../sprites/wall'
import { generateMap } from 'pac-man-map-generator'
import { Pellet } from '../sprites/pellet'
import { Pacman } from '../sprites/pac-man'
import { ScoreDisplay } from '../ui/score-display'
import { SuperPellet } from '../sprites/super-pellet'
import { Item } from '../sprites/abstracts/item'
import { Ghost, GhostState } from '../sprites/ghosts/ghost'
import { Blinky } from '../sprites/ghosts/blinky'
import { Clyde } from '../sprites/ghosts/clyde'
import { Inky } from '../sprites/ghosts/inky'
import { Pinky } from '../sprites/ghosts/pinky'
import { PauseMenu } from './pause-scene'
import { GameOverScene } from './game-over-scene'
import spritesheet from '../../../assets/spritesheet.webp'

export class PacManScene extends Scene {
  private pacman!: Pacman
  private ghosts: Ghost[] = []
  private scoreDisplay!: ScoreDisplay
  private gameOver: boolean = false

  constructor() {
    super('PacManScene')
  }

  preload() {
    this.load.image('spritesheet', spritesheet)
  }

  create() {
    this.gameOver = false
    this.physics.world.colliders.destroy()

    // Pause functionality
    this.input.keyboard?.on('keydown-P', () => {
      this.scene.pause()
      this.scene.launch('PauseMenu')
    })

    this.events.on('game-over', () => {
      this.gameOver = true
      this.physics.pause()
      this.scene.launch('GameOverScene', {
        score: this.scoreDisplay.getScore(),
      })
    })

    this.createGraphics()
    const map = generateMap()
    const items = this.physics.add.staticGroup()
    const fourCorners = SuperPellet.getFourCorners(map)

    map.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block?.type === 'wall') {
          new Wall(this, x, y)
        } else if (block?.type === 'empty' && (x !== 14 || y !== 19)) {
          // Place super pellets in the four corners
          if (fourCorners.some((corner) => corner.x === x && corner.y === y)) {
            items.add(new SuperPellet(this, x, y))
            return
          }

          const surroundingBlocks = [
            map[y - 1]?.[x], // Up
            map[y + 1]?.[x], // Down
            map[y]?.[x - 1], // Left
            map[y]?.[x + 1], // Right
            map[y - 1]?.[x - 1], // Up-Left
            map[y - 1]?.[x + 1], // Up-Right
            map[y + 1]?.[x - 1], // Down-Left
            map[y + 1]?.[x + 1], // Down-Right
          ]

          // No pellets in the ghost house or next to it
          if (surroundingBlocks.some((b) => b?.type === 'ghost-house')) {
            return
          }

          items.add(new Pellet(this, x, y))
        }
      })
    })

    const ghostCollisionGroup = this.physics.add.group([])

    this.pacman = new Pacman(this, map)
    ghostCollisionGroup.add(this.pacman)

    this.scoreDisplay = new ScoreDisplay(this, 4, 4)
    this.physics.add.overlap(
      this.pacman,
      items,
      (_pacman, item) => {
        if (!(item instanceof Item)) {
          return
        }

        if (item instanceof SuperPellet) {
          this.ghosts.forEach((ghost) => ghost.scare())
        }

        this.scoreDisplay.addPoints(item.points)
        item.destroy()
        this.pacman.eatPellet(item.coords.x, item.coords.y)
        this.ghosts.forEach((ghost) => ghost.countPellet())
      },
      undefined,
      this,
    )

    //Ghosts
    // Corner order: top-left, top-right, bottom-left, bottom-right
    const blinky = new Blinky(this, map, this.pacman, fourCorners[1])
    this.ghosts.push(
      new Pinky(this, map, this.pacman, fourCorners[0]),
      blinky,
      new Clyde(this, map, this.pacman, fourCorners[2]),
    )

    // Inky needs a reference to Blinky to determine its target
    this.ghosts.push(new Inky(this, map, this.pacman, blinky, fourCorners[3]))

    this.ghosts.forEach((ghost) => ghostCollisionGroup.add(ghost))

    this.physics.add.overlap(this.pacman, ghostCollisionGroup, (_, o2) => {
      const ghost = o2 as Ghost
      if (ghost.ghostState === GhostState.FRIGHTENED) {
        this.scoreDisplay.addPoints(200)
        ghost.handleDeath()
      } else {
        this.pacman.handleDeath()
      }
    })
  }

  update(): void {
    if (this.gameOver) {
      return
    }

    this.pacman.update()
    this.ghosts.forEach((ghost) => {
      if (ghost.ghostState !== GhostState.DEAD) ghost.update()
    })
  }

  private createGraphics() {
    Pacman.loadTextures(this.textures)
    Pacman.loadAnimations(this.anims)
    Ghost.loadTextures(this.textures)
    Ghost.loadAnimations(this.anims)
    Wall.addWallGraphics(this)
    Pellet.addPelletGraphics(this)
    SuperPellet.addSuperPelletGraphics(this)
  }
}

export function createPacManScene(container: HTMLDivElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    backgroundColor: '#5e5f60ff',
    width: 896,
    height: 992,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PacManScene, PauseMenu, GameOverScene],
  }

  return new Phaser.Game(config)
}
