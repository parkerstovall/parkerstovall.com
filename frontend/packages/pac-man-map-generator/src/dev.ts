import { generateMap } from './map-generator'

const output = document.getElementById('output')!

function render() {
  const map = generateMap({
    map: {
      bounds: { width: 28, height: 28 },
      teleporter: { min: 1, max: 2 },
    },
    mapMaker: {
      manager: { min: 2, max: 4 },
      builder: { minDistanceBeforeTurn: 3, maxDistanceBeforeTurn: 8 },
    },
    debug: true,
  })

  output.textContent = JSON.stringify(map, null, 2)
}

document.getElementById('generate')?.addEventListener('click', render)
render()
