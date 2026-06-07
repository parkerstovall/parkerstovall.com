import { mapGeneratorOptionsSchema } from './options'

describe('mapGeneratorOptionsSchema', () => {
  const base = {
    map: {
      bounds: {
        width: 28,
        height: 31,
      },
      teleporter: {
        min: 1,
        max: 4,
      },
      path: {
        min: 100,
        max: 300,
      },
    },
    mapMaker: {
      manager: {
        min: 2,
        max: 4,
      },
      builder: {
        minDistanceBeforeTurn: 3,
        maxDistanceBeforeTurn: 6,
      },
    },
  }

  it('accepts a valid options object', () => {
    expect(() => mapGeneratorOptionsSchema.parse(base)).not.toThrow()
  })

  it('rejects an odd width', () => {
    expect(() =>
      mapGeneratorOptionsSchema.parse({
        ...base,
        map: {
          ...base.map,
          bounds: {
            width: 27,
            height: 31,
          },
        },
      }),
    ).toThrow('Width must be an even number')
  })

  it('rejects an even height', () => {
    expect(() =>
      mapGeneratorOptionsSchema.parse({
        ...base,
        map: {
          ...base.map,
          bounds: {
            width: 28,
            height: 30,
          },
        },
      }),
    ).toThrow('Height must be an odd number')
  })

  it('rejects path min greater than path max', () => {
    expect(() =>
      mapGeneratorOptionsSchema.parse({
        ...base,
        map: {
          ...base.map,
          path: {
            min: 301,
            max: 300,
          },
        },
      }),
    ).toThrow('Min path count must be less than or equal to max path count')
  })

  it('rejects teleporter max at least half the map height', () => {
    expect(() =>
      mapGeneratorOptionsSchema.parse({
        ...base,
        map: {
          ...base.map,
          teleporter: {
            min: 1,
            max: 16,
          },
        },
      }),
    ).toThrow('Max teleporter count must be less than half the height')
  })
})
