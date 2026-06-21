export const LAYERS = {
  BACKGROUND_LAYER: 0,
  GAME_LAYER: 1,
  UI_LAYER: 2,
} as const

export type LAYER_KEYS = (typeof LAYERS)[keyof typeof LAYERS]

export const CACHE_NAMES = {
  Z_INDEX_SORT: 0,
  IGNORE_PLAYER: 1,
}

export type CACHE_KEYS = (typeof CACHE_NAMES)[keyof typeof CACHE_NAMES]
