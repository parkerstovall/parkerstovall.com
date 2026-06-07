import { vi, describe, it, expect, afterEach } from 'vitest'

vi.mock('./config', () => ({
  createGameConfig: vi.fn(() => ({
    type: 'AUTO',
  })),
}))

vi.mock('./MobileControls', () => ({
  MobileControls: vi.fn(function (this: { destroy: ReturnType<typeof vi.fn> }) {
    this.destroy = vi.fn()
  }),
}))

vi.mock('phaser', () => ({
  default: {
    Game: vi.fn(function (this: {
      registry: { set: ReturnType<typeof vi.fn> }
    }) {
      this.registry = {
        set: vi.fn(),
      }
    }),
  },
}))

import Phaser from 'phaser'
import { startMustachio } from './main'
import { createGameConfig } from './config'
import { MobileControls } from './MobileControls'

describe('startMustachio', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    })
  })

  it('throws when container cannot be found', () => {
    expect(() => startMustachio('missing')).toThrow(
      'Container with id "missing" not found',
    )
  })

  it('creates a game with config when container exists', () => {
    document.body.innerHTML = '<div id="game-container"></div>'

    const game = startMustachio('game-container')

    expect(createGameConfig).toHaveBeenCalledTimes(1)
    expect(Phaser.Game).toHaveBeenCalledTimes(1)
    expect(game).toBeDefined()
  })

  it('attaches mobile controls for touch-capable devices', () => {
    document.body.innerHTML = '<div id="game-container"></div>'
    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      value: 2,
      configurable: true,
    })

    startMustachio('game-container')

    expect(MobileControls).toHaveBeenCalledTimes(1)
  })
})
