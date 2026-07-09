import {
  Engine,
  LAYERS,
  RayCastCamera,
  TextObject,
  TimerObject,
  WHITE,
  type Scene,
  type Transform,
} from '@parkerstovall.com/game-engine'
import {
  DefaultOptions,
  generateMap,
} from '@parkerstovall.com/pac-man-map-generator'
import {
  Background,
  MazePlayer,
  SecondBackground,
  Wall,
  Foreground,
} from './game-objects'
import { BLOCK_SIZE, GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE } from './constants'
import { getTransforms } from './get-transforms'

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function MazeGameScene() {
  const mazeGameScene: Scene = {
    name: 'Maze Game',
    load: (engine: Engine) => {
      const onTime = () => {
        engine.addObject(
          new Foreground(engine, {
            r: 255,
            g: 0,
            b: 0,
            a: 0.6,
          }),
        )

        engine.addObject(
          new TextObject(
            engine,
            {
              x: GAME_WIDTH / 2 - 150,
              y: GAME_HEIGHT / 2 - 24,
              width: 300,
              height: -1,
              rotation: 0,
            },
            'TOO LATE! (r to restart)',
            WHITE,
            'center',
          ),
        )

        engine.togglePause()
      }

      engine.renderSize = 3000
      const teleCount = 6
      const playerStart = randomInt(0, teleCount - 1)
      const playerGoal = randomInt(0, teleCount - 1)

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

      // Assemble Player Start
      for (const row of map) {
        const col = row[0]
        if (col?.type !== 'teleporter') {
          continue
        }

        if (foundTele % teleCount === playerStart) {
          playerX = col.position.x * BLOCK_SIZE
          playerY = col.position.y * BLOCK_SIZE
          col.type = 'empty'
          break
        }

        foundTele++
      }

      foundTele = 0

      // Assemble Player Goal
      for (const row of map) {
        const col = row[row.length - 1]
        if (col?.type !== 'teleporter') {
          continue
        }

        if (foundTele % teleCount === playerGoal) {
          targetX = col.position.x * BLOCK_SIZE
          targetY = col.position.y * BLOCK_SIZE
          col.type = 'empty'
          break
        }

        foundTele++
      }

      const detectSimpeBoxCollision = (
        transformA: Transform,
        transformB: Transform,
      ) => {
        if (transformA.x + transformA.width < transformB.x + 1) {
          return false
        }

        if (transformA.x + 1 > transformB.x + transformB.width) {
          return false
        }

        if (transformA.y + transformA.height < transformB.y + 1) {
          return false
        }

        if (transformA.y + 1 > transformB.y + transformB.height) {
          return false
        }

        return true
      }

      const transforms = getTransforms(map)
      for (const transform of transforms) {
        const wall = new Wall(engine, transform, LAYERS.GAME_LAYER)
        engine.addObject(wall)
      }

      engine.addObject(new Background(engine, GAME_WIDTH, GAME_HEIGHT))
      engine.addObject(new SecondBackground(engine, GAME_WIDTH, GAME_HEIGHT))

      const playerPos: Transform = {
        rotation: 0,
        x: playerX + BLOCK_SIZE / 2 - PLAYER_SIZE / 2,
        y: playerY + BLOCK_SIZE / 2 - PLAYER_SIZE / 2,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }

      const player = new MazePlayer(
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
          GAME_WIDTH,
          GAME_HEIGHT,
          'game',
          player,
        ),
      )

      // const maxWidth = map[0].length * BLOCK_SIZE
      // const maxHeight = map.length * BLOCK_SIZE
      // engine.addCamera(
      //   new TwoDimensionalCamera(
      //     engine,
      //     {
      //       x: playerPos.x,
      //       y: playerPos.y,
      //       width: 0,
      //       height: 0,
      //       rotation: 0,
      //     },
      //     LAYERS.UI_LAYER,
      //     maxWidth,
      //     maxHeight,
      //     'game2',
      //   ),
      // )

      engine.addObject(
        new TimerObject(
          engine,
          { x: 15, y: 15, width: 1000, height: -1, rotation: 0 },
          60,
          onTime,
          'Time - ',
        ),
      )
    },
  }

  const engine = new Engine()
  engine.setScene(mazeGameScene)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'r') {
      engine.setScene(mazeGameScene)
    }
  })
}
