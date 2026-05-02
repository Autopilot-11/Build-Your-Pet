import { useEffect, useRef } from 'react'
import { CELL_WIDTH, CELL_HEIGHT, ANIMATIONS } from '../lib/constants'
import type { AnimationName } from '../lib/constants'

interface AnimatedPreviewProps {
  spritesheetBlob: Blob | null
  animation: AnimationName
  scale?: number
}

export function AnimatedPreview({ spritesheetBlob, animation, scale = 3 }: AnimatedPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!spritesheetBlob || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const anim = ANIMATIONS[animation]
    const displayW = CELL_WIDTH * scale
    const displayH = CELL_HEIGHT * scale

    const url = URL.createObjectURL(spritesheetBlob)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      let frame = 0
      let lastTime = 0
      const interval = 1000 / anim.fps

      function draw(time: number) {
        if (time - lastTime >= interval) {
          lastTime = time
          ctx.clearRect(0, 0, displayW, displayH)
          const sx = frame * CELL_WIDTH
          const sy = anim.row * CELL_HEIGHT
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(img, sx, sy, CELL_WIDTH, CELL_HEIGHT, 0, 0, displayW, displayH)
          frame = (frame + 1) % anim.frames
        }
        rafRef.current = requestAnimationFrame(draw)
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    img.src = url

    return () => {
      cancelAnimationFrame(rafRef.current)
      URL.revokeObjectURL(url)
    }
  }, [spritesheetBlob, animation, scale])

  return (
    <canvas
      ref={canvasRef}
      width={CELL_WIDTH * scale}
      height={CELL_HEIGHT * scale}
      className="rounded-lg border border-zinc-700"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
