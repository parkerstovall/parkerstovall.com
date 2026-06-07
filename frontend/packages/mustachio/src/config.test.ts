vi.mock('phaser', () => ({
  default: {
    AUTO: 'AUTO',
    Scale: {
      FIT: 'FIT',
      CENTER_BOTH: 'CENTER_BOTH',
    },
  },
}))

vi.mock('./scenes/GameScene', () => ({
  GameScene: class GameScene {},
}))

vi.mock('./scenes/BackgroundScene', () => ({
  BackgroundScene: class BackgroundScene {},
}))

vi.mock('./scenes/UIScene', () => ({
  UIScene: class UIScene {},
}))

import { createGameConfig } from './config'
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY, SKY_COLOR } from './constants'

describe('createGameConfig', () => {
  it('returns the expected Phaser configuration contract', () => {
    const parent = document.createElement('div')

    const config = createGameConfig(parent, true)

    expect(config.type).toBe('AUTO')
    expect(config.parent).toBe(parent)
    expect(config.width).toBe(GAME_WIDTH)
    expect(config.height).toBe(GAME_HEIGHT)
    expect(config.backgroundColor).toBe(SKY_COLOR)
    expect(config.scale?.mode).toBe('FIT')
    expect(config.scale?.autoCenter).toBe('CENTER_BOTH')
    expect(config.physics?.default).toBe('arcade')
    expect(config.physics?.arcade?.gravity?.y).toBe(GRAVITY)
    expect(config.physics?.arcade?.debug).toBe(true)
    expect(config.scene).toHaveLength(3)
  })
})
