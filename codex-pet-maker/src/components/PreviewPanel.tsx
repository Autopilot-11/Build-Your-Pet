import { useState } from 'react'
import { AnimatedPreview } from './AnimatedPreview'
import type { AnimationName } from '../lib/constants'

interface PreviewPanelProps {
  originalUrl: string | null
  spritesheetBlob: Blob | null
}

const PREVIEW_ANIMS: AnimationName[] = ['idle', 'jumping', 'running', 'waving']

export function PreviewPanel({ originalUrl, spritesheetBlob }: PreviewPanelProps) {
  const [selectedAnim, setSelectedAnim] = useState<AnimationName>('idle')

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="font-mono text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
        Step 3 — Preview
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3">
          <span className="text-zinc-400 text-sm">Original</span>
          {originalUrl ? (
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-48 object-contain rounded"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-zinc-600 text-sm">
              No image yet
            </div>
          )}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3">
          <span className="text-zinc-400 text-sm">Pixelated preview</span>
          {spritesheetBlob ? (
            <>
              <AnimatedPreview spritesheetBlob={spritesheetBlob} animation={selectedAnim} scale={3} />
              <select
                value={selectedAnim}
                onChange={(e) => setSelectedAnim(e.target.value as AnimationName)}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-orange-400"
              >
                {PREVIEW_ANIMS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </>
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-zinc-600 text-sm">
              Generate to preview
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
