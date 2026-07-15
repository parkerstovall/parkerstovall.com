import type { Transform } from '@parkerstovall.com/game-engine'
import type { PacManMap } from '@parkerstovall.com/pac-man-map-generator'
import { BLOCK_SIZE, ENEMY_SIZE } from './constants'

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getStartAndGoal = (map: PacManMap, teleCount: number) => {
  const playerStart = randomInt(0, teleCount - 1)
  const playerGoal = randomInt(0, teleCount - 1)

  let foundTele = 0
  let playerX = 0
  let playerY = 0
  let targetX = 0
  let targetY = 0

  // Assemble Player Start
  for (const row of map) {
    const col = row[0]
    if (col?.type !== 'teleporter') {
      continue
    }

    if (foundTele % teleCount === playerStart) {
      playerX = col.position.x * BLOCK_SIZE
      playerY = col.position.y * BLOCK_SIZE
      col.type = 'empty'
      break
    }

    foundTele++
  }

  foundTele = 0

  // Assemble Player Goal
  for (const row of map) {
    const col = row[row.length - 1]
    if (col?.type !== 'teleporter') {
      continue
    }

    if (foundTele % teleCount === playerGoal) {
      targetX = col.position.x * BLOCK_SIZE
      targetY = col.position.y * BLOCK_SIZE
      col.type = 'empty'
      break
    }

    foundTele++
  }

  return {
    playerX,
    playerY,
    targetX,
    targetY,
  }
}

export const addEnemies = (
  map: PacManMap,
  playerX: number,
  playerY: number,
  transforms: Transform[] = [],
): Transform[] => {
  const enemyTotal = 10

  while (transforms.length < enemyTotal) {
    const y = randomInt(0, map.length)
    const x = randomInt(0, map[y]?.length)

    if (map[y]?.[x]?.type !== 'empty') {
      continue
    }

    const left = Math.pow(x * BLOCK_SIZE - playerX, 2)
    const right = Math.pow(y * BLOCK_SIZE - playerY, 2)
    const dist = Math.sqrt(left + right)

    // Dont start TOO close to the player
    if (dist < BLOCK_SIZE * 5) {
      continue
    }

    transforms.push({
      x: x * BLOCK_SIZE + ENEMY_SIZE / 2,
      y: y * BLOCK_SIZE + ENEMY_SIZE / 2,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      renderHeight: ENEMY_SIZE,
      rotation: 0,
    })
  }

  return transforms
}

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
