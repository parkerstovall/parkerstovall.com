import { LAYERS } from '../constants'
import type { Scene } from '../types'
import { DevObject } from './dev-object'
import { DevPlayer } from './dev-player'
import { RayCastCamera } from '../rendering/ray-caster'
import { TwoDimensionalCamera } from '../rendering'

export const devScene: Scene = {
  name: 'Dev Scene',
  load: (engine) => {
    engine.renderSize = 2000
    const blue = engine.addPlayer(
      new DevPlayer(
        engine,
        { x: 75, y: 100, height: 10, width: 10, rotation: 0 },
        LAYERS.GAME_LAYER,
        { r: 0, g: 100, b: 205 },
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 251,
          y: 0,
          width: 251,
          height: 25,
          rotation: 0,
        },
        LAYERS.GAME_LAYER,
        { r: 50, g: 200, b: 125 },
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 0,
          y: 0,
          width: 500,
          height: 250,
          rotation: 0,
        },
        LAYERS.BACKGROUND_LAYER,
        { r: 205, g: 205, b: 205 },
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 0,
          y: 250,
          width: 500,
          height: 250,
          rotation: 0,
        },
        LAYERS.BACKGROUND_LAYER,
        { r: 25, g: 25, b: 25 },
      ),
    )

    engine.addObject(
      new DevObject(
        engine,
        {
          x: 1,
          y: -100,
          width: 1000,
          height: 25,
          rotation: 0,
        },
        LAYERS.GAME_LAYER,
        { r: 0, g: 100, b: 205 },
      ),
    )

    engine.addCamera(
      new RayCastCamera(
        engine,
        {
          x: 100,
          y: 100,
          height: 50,
          width: 50,
          rotation: 0,
        },
        LAYERS.UI_LAYER,
        500,
        500,
        'game',
        blue,
      ),
    )

    engine.addCamera(
      new TwoDimensionalCamera(
        engine,
        {
          x: 100,
          y: 100,
          height: 50,
          width: 50,
          rotation: 0,
        },
        LAYERS.UI_LAYER,
        500,
        500,
        'game-2',
        blue,
      ),
    )
  },
}
