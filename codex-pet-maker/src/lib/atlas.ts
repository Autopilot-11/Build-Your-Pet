import { ATLAS_WIDTH, ATLAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT, COLUMNS } from './constants'

export interface AtlasFrame {
  row: number
  col: number
  imageData: ImageData
}

export async function buildSpriteSheet(frames: AtlasFrame[]): Promise<Blob> {
  const canvas = new OffscreenCanvas(ATLAS_WIDTH, ATLAS_HEIGHT)
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT)

  for (const frame of frames) {
    const x = frame.col * CELL_WIDTH
    const y = frame.row * CELL_HEIGHT
    ctx.putImageData(frame.imageData, x, y)
  }

  const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.95 })
  return blob
}

function shiftCell(base: ImageData, dx: number, dy: number): ImageData {
  const w = base.width
  const h = base.height
  const out = new ImageData(w, h)
  const src = base.data
  const dst = out.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x - dx
      const ny = y - dy
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
      const si = (ny * w + nx) * 4
      const di = (y * w + x) * 4
      dst[di]     = src[si]
      dst[di + 1] = src[si + 1]
      dst[di + 2] = src[si + 2]
      dst[di + 3] = src[si + 3]
    }
  }
  return out
}

function flipHorizontal(base: ImageData): ImageData {
  const w = base.width
  const h = base.height
  const out = new ImageData(w, h)
  const src = base.data
  const dst = out.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + (w - 1 - x)) * 4
      const di = (y * w + x) * 4
      dst[di]     = src[si]
      dst[di + 1] = src[si + 1]
      dst[di + 2] = src[si + 2]
      dst[di + 3] = src[si + 3]
    }
  }
  return out
}

function dimCell(base: ImageData, alphaFactor: number): ImageData {
  const out = new ImageData(new Uint8ClampedArray(base.data), base.width, base.height)
  for (let i = 3; i < out.data.length; i += 4) {
    out.data[i] = Math.round(out.data[i] * alphaFactor)
  }
  return out
}

export function generateAllFrames(baseCell: ImageData): AtlasFrame[] {
  const frames: AtlasFrame[] = []

  // Row 0: idle — subtle bob on frames 2,3,6,7
  const idleBob = [0, 0, -2, -2, 0, 0, -2, -2]
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 0, col, imageData: shiftCell(baseCell, 0, idleBob[col]) })
  }

  // Row 1: waving — all base (placeholder)
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 1, col, imageData: baseCell })
  }

  // Row 2: jumping — arc Y offsets
  const jumpOffsets = [0, -8, -14, -16, -14, -8, 0, 0]
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 2, col, imageData: shiftCell(baseCell, 0, jumpOffsets[col]) })
  }

  // Row 3: failed — last 4 frames with horizontal shake
  const failShake = [0, 0, 0, 0, 2, -2, 2, -2]
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 3, col, imageData: shiftCell(baseCell, failShake[col], 0) })
  }

  // Row 4: review — all base (placeholder)
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 4, col, imageData: baseCell })
  }

  // Row 5: running-right — alternating Y bob
  const runBob = [0, -2, 0, -2, 0, -2, 0, -2]
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 5, col, imageData: shiftCell(baseCell, 0, runBob[col]) })
  }

  // Row 6: running-left — horizontally flipped run
  const flipped = flipHorizontal(baseCell)
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 6, col, imageData: shiftCell(flipped, 0, runBob[col]) })
  }

  // Row 7: running — same as row 5
  for (let col = 0; col < COLUMNS; col++) {
    frames.push({ row: 7, col, imageData: shiftCell(baseCell, 0, runBob[col]) })
  }

  // Row 8: waiting — frames 4-7 dimmed for "drowsy" feel
  for (let col = 0; col < COLUMNS; col++) {
    const cell = col >= 4 ? dimCell(baseCell, 0.85) : baseCell
    frames.push({ row: 8, col, imageData: cell })
  }

  return frames
}
