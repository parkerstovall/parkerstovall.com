import { vi, describe, it, expect, afterEach } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('phaser', () => ({
  default: {},
}))

vi.mock('./game/_scenes/pac-man-scene', () => ({
  createPacManScene: vi.fn(() => ({
    destroy: vi.fn(),
  })),
}))

import { PacMan } from './pac-man'
import { createPacManScene } from './game/_scenes/pac-man-scene'

describe('PacMan', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates a scene on mount and destroys it on unmount', () => {
    const { unmount } = render(<PacMan />)

    expect(createPacManScene).toHaveBeenCalledTimes(1)

    const scene = (
      createPacManScene as unknown as {
        mock: {
          results: Array<{ value: { destroy: ReturnType<typeof vi.fn> } }>
        }
      }
    ).mock.results[0].value

    unmount()

    expect(scene.destroy).toHaveBeenCalledWith(true)
  })

  it('renders the expected game container dimensions', () => {
    const { container } = render(<PacMan />)
    const root = container.firstElementChild as HTMLElement

    expect(root.style.width).toBe('448px')
    expect(root.style.height).toBe('496px')
  })
})
