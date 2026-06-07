import { getRandomDirection, getRandomInt } from './shared'

describe('shared utilities', () => {
  describe('getRandomDirection', () => {
    it('returns null when every direction is ignored', () => {
      const result = getRandomDirection([
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ])

      expect(result).toBeNull()
    })

    it('returns one of the non-ignored directions', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const result = getRandomDirection([{ x: 0, y: -1 }])

      expect(result).toEqual({ x: 1, y: 0 })
    })
  })

  describe('getRandomInt', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('returns odd numbers when odd=true', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const result = getRandomInt(2, 6, true)

      expect(result % 2).toBe(1)
      expect(result).toBeGreaterThanOrEqual(2)
      expect(result).toBeLessThanOrEqual(6)
    })

    it('returns even numbers when odd=false', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const result = getRandomInt(1, 7, false)

      expect(result % 2).toBe(0)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(7)
    })
  })
})
