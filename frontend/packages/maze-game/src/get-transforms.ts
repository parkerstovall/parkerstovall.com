import type { Transform } from '@parkerstovall.com/game-engine'
import type { PacManMap } from '@parkerstovall.com/pac-man-map-generator'
import { BLOCK_SIZE } from './constants'

export const getTransforms = (map: PacManMap) => {
  const transforms: Transform[] = []
  let currentStartX: number | null = null
  let currentStartY: number | null = null
  let currentLength = 1

  const pushTransform = () => {
    if (currentStartX !== null && currentStartY !== null) {
      transforms.push({
        x: currentStartX * BLOCK_SIZE,
        y: currentStartY * BLOCK_SIZE,
        width: currentLength * BLOCK_SIZE,
        height: BLOCK_SIZE,
        renderHeight: BLOCK_SIZE,
        rotation: 0,
      })
    }

    currentStartX = null
    currentStartY = null
    currentLength = 1
  }

  // Assemble Maze
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const square = map[i][j]
      if (!square || square.type === 'empty') {
        pushTransform()
        continue
      }

      if (currentStartX === null) {
        currentStartX = square.position.x
        currentStartY = square.position.y
      } else {
        currentLength++
      }
    }

    pushTransform()
  }

  for (let i = transforms.length - 1; i >= 0; i--) {
    const transformToCollapse = transforms[i]
    // if its wider than a single square, ignore
    if (transformToCollapse.width !== BLOCK_SIZE) {
      continue
    }

    for (let j = transforms.length - 1; j >= 0; j--) {
      const transformToCheck = transforms[j]

      // we dont care if the x pos is different or if its wider than
      // single square
      if (
        transformToCheck.width !== BLOCK_SIZE ||
        transformToCheck.x !== transformToCollapse.x
      ) {
        continue
      }

      if (
        transformToCheck.y ===
        transformToCollapse.y + transformToCollapse.height
      ) {
        // add size to main loop transform, remove child loop transform
        transformToCollapse.height += transformToCheck.height
        transforms.splice(j, 1)

        // neeed to reset the loop to truly collapse everything
        i = transforms.length - 1
        break
      }
    }
  }

  return transforms
}
