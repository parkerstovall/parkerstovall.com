import { generateMap } from './map-generator'

const output = document.getElementById('output')!

function render() {
  const map = generateMap({
    map: {
      bounds: { width: 28, height: 29 },
      teleporter: { min: 1, max: 2 },
    },
    mapMaker: {
      manager: { min: 2, max: 4 },
      builder: { minDistanceBeforeTurn: 3, maxDistanceBeforeTurn: 8 },
    },
    debug: true,
  })

  const html = map
    .map((row) =>
      row
        .map((cell) => {
          if (cell?.type === 'wall') return '⬛'
          if (cell?.type === 'teleporter') return '🌀'
          if (cell?.type === 'empty') return '⬜'
          if (cell?.type === 'ghost-house') return '👻'
          return '⬛'
        })
        .join(''),
    )
    .join('\n')

  output.innerHTML = html
}

document.getElementById('generate')?.addEventListener('click', render)
render()
