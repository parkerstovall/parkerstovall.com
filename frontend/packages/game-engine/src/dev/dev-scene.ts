import { LAYERS } from '../constants'
import type { Scene } from '../types'
import { TwoDimensionalCamera } from '../rendering/two-dimensional'
import { DevObject } from './dev-object'
import { DevPlayer } from './dev-player'

export const devScene: Scene = {
  name: 'Dev Scene',
  load: (engine) => {
    engine.renderSize = 250
    const blue = engine.addPlayer(
      new DevPlayer(
        engine,
        { x: 75, y: 100, height: 25, width: 25, rotation: 0 },
        LAYERS.GAME_LAYER,
        'blue',
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
        'gray',
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
        'gray',
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
        250,
        250,
        'game',
        blue,
      ),
    )
  },
}
