export const directions = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
}

export const directionsArray = [
  { x: 0, y: -1, dir: directions.UP },
  { x: 0, y: 1, dir: directions.DOWN },
  { x: -1, y: 0, dir: directions.LEFT },
  { x: 1, y: 0, dir: directions.RIGHT },
]

// 2px per second base speed
export const BASE_SPEED = 120

// 100% speed for pac-man
export const PAC_MAN_SPEED = BASE_SPEED

// 125% speed for pac-man in scatter mode
export const PAC_MAN_SPEED_SCATTER = BASE_SPEED * 1.25

// 90% while eating
export const PAC_MAN_SPEED_EATING = BASE_SPEED * 0.9

// 50% speed when going through tunnels
export const PAC_MAN_SPEED_TUNNEL = BASE_SPEED * 0.5

// 93.75% speed for ghosts
export const GHOST_SPEED = BASE_SPEED * 0.9375

// 62.5% speed for frightened ghosts
export const GHOST_SPEED_FRIGHTENED = BASE_SPEED * 0.625
