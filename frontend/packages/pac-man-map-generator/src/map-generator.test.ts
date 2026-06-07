import { describe, it, expect } from 'vitest'
import { generateMap } from './map-generator'

function getPacManStart(width: number, height: number) {
  const ghostHouseArea = {
    x: width / 2 - 2,
    y: height / 2 - 4,
    width: 2,
    height: 3,
  }

  let pacManY = Math.floor(ghostHouseArea.y + ghostHouseArea.height + 2)
  let pacManX = Math.floor(ghostHouseArea.x + ghostHouseArea.width / 2 - 1)

  if (pacManX % 2 === 0) {
    pacManX += 1
  }

  if (pacManY % 2 === 0) {
    pacManY += 1
  }

  return { x: pacManX, y: pacManY }
}

describe('generateMap', () => {
  const opts = {
    map: {
      bounds: {
        width: 28,
        height: 31,
      },
      teleporter: {
        min: 1,
        max: 2,
      },
    },
    mapMaker: {
      manager: {
        min: 1,
        max: 1,
      },
      builder: {
        minDistanceBeforeTurn: 4,
        maxDistanceBeforeTurn: 4,
      },
    },
  }

  it('returns a map with expected bounds and symmetry', () => {
    const map = generateMap(opts)

    expect(map).toHaveLength(opts.map.bounds.height)
    map.forEach((row) => expect(row).toHaveLength(opts.map.bounds.width))

    for (let y = 0; y < opts.map.bounds.height; y++) {
      for (let x = 0; x < opts.map.bounds.width; x++) {
        const mirroredX = opts.map.bounds.width - 1 - x
        expect(map[y][x]?.type ?? null).toBe(map[y][mirroredX]?.type ?? null)
      }
    }
  })

  it('keeps teleporters within configured range and on odd rows', () => {
    const map = generateMap(opts)
    const teleporters: Array<{ x: number; y: number }> = []

    map.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block?.type === 'teleporter') {
          teleporters.push({ x, y })
        }
      })
    })

    const pairCount = teleporters.length / 2
    expect(pairCount).toBeGreaterThanOrEqual(opts.map.teleporter.min)
    expect(pairCount).toBeLessThanOrEqual(opts.map.teleporter.max)

    teleporters.forEach((teleporter) => {
      expect(teleporter.y % 2).toBe(1)
    })
  })

  it('ensures the pac-man start area is walkable', () => {
    const map = generateMap(opts)
    const start = getPacManStart(opts.map.bounds.width, opts.map.bounds.height)

    expect(map[start.y][start.x]?.type).toBe('empty')
  })
})
