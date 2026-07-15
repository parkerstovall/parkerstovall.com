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
  Enemy,
} from './game-objects'
import { BLOCK_SIZE, GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE } from './constants'
import { addEnemies, getStartAndGoal, getTransforms } from './app-code'

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

      const { playerX, playerY, targetX, targetY } = getStartAndGoal(
        map,
        teleCount,
      )

      const playerPos: Transform = {
        rotation: 0,
        x: playerX + BLOCK_SIZE / 2 - PLAYER_SIZE / 2,
        y: playerY + BLOCK_SIZE / 2 - PLAYER_SIZE / 2,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }

      const player = new MazePlayer(engine, playerPos, targetX, targetY)
      engine.addPlayer(player)

      for (const transform of addEnemies(map, playerX, playerY)) {
        engine.addObject(new Enemy(engine, transform, player, map))
      }

      const transforms = getTransforms(map)
      for (const transform of transforms) {
        const wall = new Wall(engine, transform, LAYERS.GAME_LAYER)
        engine.addObject(wall)
      }

      engine.addObject(new Background(engine, GAME_WIDTH, GAME_HEIGHT))
      engine.addObject(new SecondBackground(engine, GAME_WIDTH, GAME_HEIGHT))

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
          BLOCK_SIZE,
        ),
      )

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
