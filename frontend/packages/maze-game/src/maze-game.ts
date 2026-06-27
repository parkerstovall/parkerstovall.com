import {
  Engine,
  LAYERS,
  RayCastCamera,
  TwoDimensionalCamera,
  type Scene,
  type Transform,
} from '@parkerstovall.com/game-engine'
import {
  DefaultOptions,
  generateMap,
} from '@parkerstovall.com/pac-man-map-generator'
import { Background, Player, Foreground, Wall } from './game-objects'

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function MazeGameScene() {
  const mazeGameScene: Scene = {
    name: 'Maze Game',
    load: (engine: Engine) => {
      engine.renderSize = 3000
      const width = 1280
      const height = 720
      const size = 40
      const playerSize = size / 4
      const teleCount = 6

      const startIndexes = [1, 3, 5, 7, 9, 11]
      const goalIndexes = [0, 2, 4, 6, 8, 10]
      const playerStartIndex =
        startIndexes[randomInt(0, startIndexes.length - 1)]
      const playerGoalIndex = goalIndexes[randomInt(0, goalIndexes.length - 1)]

      let foundTele = 0
      let playerX = 0
      let playerY = 0
      let targetX = 0
      let targetY = 0

      const map = generateMap({
        ...DefaultOptions,
        map: {
          ...DefaultOptions.map,
          teleporter: {
            min: teleCount,
            max: teleCount,
          },
        },
      })

      let currentStartX: number | null = null
      let currentStartY: number | null = null
      let currentLength = 1

      const transforms: Transform[] = []

      for (const col of map) {
        currentStartX = null
        currentStartY = null
        currentLength = 1
        for (const row of col) {
          if (!row) continue

          if (row.type === 'empty' || row.type === 'teleporter') {
            let shouldCont = row.type === 'empty'

            // type === teleporter
            if (!shouldCont) {
              foundTele++
              if (!playerX) {
                if (foundTele === playerStartIndex) {
                  playerX = size * row.position.x - playerSize * 2
                  playerY = size * (row.position.y + 0.5)
                  shouldCont = true
                }
              } else if (!targetX) {
                if (foundTele === playerGoalIndex) {
                  targetX = size * row.position.x - playerSize * 2
                  targetY = size * (row.position.y + 0.5)
                  shouldCont = true
                }
              }
            }

            if (shouldCont) {
              if (currentStartX !== null && currentStartY !== null) {
                transforms.push({
                  x: currentStartX * size,
                  y: currentStartY * size,
                  width: currentLength * size,
                  height: size,
                  rotation: 0,
                })
                currentStartX = null
                currentStartY = null
                currentLength = 1
              }
              continue
            }
          }

          if (currentStartX === null) {
            currentStartX = row.position.x
            currentStartY = row.position.y
          } else {
            currentLength++
          }
        }

        if (currentStartX !== null && currentStartY !== null) {
          transforms.push({
            x: currentStartX * size,
            y: currentStartY * size,
            width: currentLength * size,
            height: size,
            rotation: 0,
          })
        }
      }

      for (const transform of transforms) {
        const wall = new Wall(engine, transform, LAYERS.GAME_LAYER)
        engine.addObject(wall)
      }

      engine.addObject(new Background(engine, width, height))
      engine.addObject(new Foreground(engine, width, height))

      const playerPos: Transform = {
        rotation: 0,
        x: playerX,
        y: playerY,
        width: playerSize,
        height: playerSize,
      }

      const player = new Player(
        engine,
        playerPos,
        LAYERS.GAME_LAYER,
        targetX,
        targetY,
      )
      engine.addPlayer(player)

      engine.addCamera(
        new RayCastCamera(
          engine,
          {
            x: playerPos.x,
            y: playerPos.y,
            width: 0,
            height: 0,
            rotation: 0,
          },
          LAYERS.UI_LAYER,
          width,
          height,
          'game',
          player,
        ),
      )

      const maxWidth = map[0].length * size
      const maxHeight = map.length * size
      engine.addCamera(
        new TwoDimensionalCamera(
          engine,
          {
            x: playerPos.x,
            y: playerPos.y,
            width: 0,
            height: 0,
            rotation: 0,
          },
          LAYERS.UI_LAYER,
          maxWidth,
          maxHeight,
          'game2',
        ),
      )
    },
  }

  const engine = new Engine()
  engine.setScene(mazeGameScene)
}
