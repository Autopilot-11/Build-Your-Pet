import { removeBackground as imglyRemoveBg } from '@imgly/background-removal'
import { CELL_WIDTH, CELL_HEIGHT } from './constants'

export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = reject
    img.src = url
  })
}

export async function removeBackground(file: File): Promise<Blob> {
  const result = await imglyRemoveBg(file)
  return result
}

export async function imageToCell(
  blob: Blob,
  options: {
    cellWidth?: number
    cellHeight?: number
    pixelSize?: number
    paddingPct?: number
    paletteSize?: number
  } = {}
): Promise<ImageData> {
  const {
    cellWidth = CELL_WIDTH,
    cellHeight = CELL_HEIGHT,
    pixelSize = 4,
    paddingPct = 0.1,
  } = options

  const url = URL.createObjectURL(blob)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => { URL.revokeObjectURL(url); resolve(i) }
    i.onerror = reject
    i.src = url
  })

  const safeW = Math.floor(cellWidth * (1 - paddingPct * 2))
  const safeH = Math.floor(cellHeight * (1 - paddingPct * 2))

  // Fit image inside safe area preserving aspect ratio
  const scale = Math.min(safeW / img.width, safeH / img.height)
  const fitW = Math.floor(img.width * scale)
  const fitH = Math.floor(img.height * scale)
  const offsetX = Math.floor((cellWidth - fitW) / 2)
  const offsetY = Math.floor((cellHeight - fitH) / 2)

  // Downscale for pixelation then upscale back
  const lowW = Math.max(1, Math.floor(fitW / pixelSize))
  const lowH = Math.max(1, Math.floor(fitH / pixelSize))

  // Draw small
  const small = new OffscreenCanvas(lowW, lowH)
  const sCtx = small.getContext('2d')!
  sCtx.imageSmoothingEnabled = false
  sCtx.clearRect(0, 0, lowW, lowH)
  sCtx.drawImage(img, 0, 0, lowW, lowH)

  // Draw cell-sized canvas, upscale pixelated image
  const cell = new OffscreenCanvas(cellWidth, cellHeight)
  const cCtx = cell.getContext('2d')!
  cCtx.imageSmoothingEnabled = false
  cCtx.clearRect(0, 0, cellWidth, cellHeight)
  cCtx.drawImage(small, 0, 0, lowW, lowH, offsetX, offsetY, fitW, fitH)

  return cCtx.getImageData(0, 0, cellWidth, cellHeight)
}
