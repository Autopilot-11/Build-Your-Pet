export const ATLAS_WIDTH = 1536
export const ATLAS_HEIGHT = 1872
export const CELL_WIDTH = 192
export const CELL_HEIGHT = 208
export const COLUMNS = 8
export const ROWS = 9

export const ANIMATIONS = {
  idle:           { row: 0, frames: 8, fps: 6,  loop: true  },
  waving:         { row: 1, frames: 8, fps: 8,  loop: false },
  jumping:        { row: 2, frames: 8, fps: 10, loop: false },
  failed:         { row: 3, frames: 8, fps: 6,  loop: false },
  review:         { row: 4, frames: 8, fps: 6,  loop: true  },
  'running-right':{ row: 5, frames: 8, fps: 12, loop: true  },
  'running-left': { row: 6, frames: 8, fps: 12, loop: true  },
  running:        { row: 7, frames: 8, fps: 12, loop: true  },
  waiting:        { row: 8, frames: 8, fps: 4,  loop: true  },
} as const

export type AnimationName = keyof typeof ANIMATIONS
