export const LAYERS = {
  BACKGROUND_LAYER: 0,
  GAME_LAYER: 1,
  UI_LAYER: 2,
} as const

export type LAYER_KEYS = (typeof LAYERS)[keyof typeof LAYERS]

export const Directions = {
  LEFT: 0,
  RIGHT: 1,
  FORWARD: 2,
  BACK: 3,
} as const

export type Direction = (typeof Directions)[keyof typeof Directions]
