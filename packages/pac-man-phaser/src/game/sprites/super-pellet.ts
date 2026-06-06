import { PacManMap } from 'pac-man-map-generator'
import { ActionItem } from './abstracts/action-item'

export class SuperPellet extends ActionItem {
  readonly points: number = 50

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 8, 'super-pellet')
  }

  onCollect() {
    this.destroy()
  }

  static addSuperPelletGraphics(scene: Phaser.Scene) {
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xffffff, 1) // white pellet
    graphics.fillCircle(8, 8, 8) // 8 radius
    graphics.generateTexture('super-pellet', 16, 16)
    graphics.destroy()
  }

  // Since we use a random map generator,
  // the location of the four corners is not fixed.
  // This function finds the four 'corners' of the map,
  // defined as the four empty spaces closest to each corner of the map.
  static getFourCorners(gameMap: PacManMap) {
    const corners = [
      { x: 1, y: 1 }, // Top-left
      { x: gameMap[0].length - 2, y: 1 }, // Top-right
      { x: 1, y: gameMap.length - 2 }, // Bottom-left
      { x: gameMap[0].length - 2, y: gameMap.length - 2 }, // Bottom-right
    ]

    const cornerPelletPositions: { x: number; y: number }[] = []

    // BFS from each corner to find the nearest empty cell
    corners.forEach((corner) => {
      const queue = [corner]
      const visited = new Set<string>()
      visited.add(`${corner.x},${corner.y}`)

      while (queue.length > 0) {
        const current = queue.shift()
        if (!current) {
          continue
        }

        const cell = gameMap[current.y][current.x]

        if (cell?.type === 'empty') {
          cornerPelletPositions.push({ x: current.x, y: current.y })
          break
        }

        const directions = [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
        ]

        directions.forEach((dir) => {
          const nextX = current.x + dir.x
          const nextY = current.y + dir.y

          if (
            nextX >= 0 &&
            nextX < gameMap[0].length &&
            nextY >= 0 &&
            nextY < gameMap.length &&
            !visited.has(`${nextX},${nextY}`)
          ) {
            visited.add(`${nextX},${nextY}`)
            queue.push({ x: nextX, y: nextY })
          }
        })
      }
    })

    return cornerPelletPositions
  }
}
