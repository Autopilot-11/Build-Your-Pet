import type { AppState } from '../state/useAppState'

interface ConfigPanelProps {
  state: AppState
  onChange: (field: string, value: string | number | boolean) => void
}

export function ConfigPanel({ state, onChange }: ConfigPanelProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="font-mono text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
        Step 2 — Configure
      </h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-zinc-400 text-sm">Pet name</span>
            <input
              type="text"
              value={state.petName}
              onChange={(e) => onChange('petName', e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-zinc-400 text-sm">Description</span>
            <input
              type="text"
              value={state.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-zinc-400 text-sm">Pixel size</span>
            <select
              value={state.pixelSize}
              onChange={(e) => onChange('pixelSize', Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            >
              {[2, 4, 6, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-zinc-400 text-sm">Color palette</span>
            <select
              value={state.paletteSize}
              onChange={(e) => onChange('paletteSize', Number(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
            >
              {[8, 16, 32, 0].map((n) => (
                <option key={n} value={n}>{n === 0 ? 'Full' : n}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 justify-end">
            <span className="text-zinc-400 text-sm">Remove background</span>
            <div className="flex items-center gap-2 h-[42px]">
              <input
                type="checkbox"
                checked={state.removeBackground}
                onChange={(e) => onChange('removeBackground', e.target.checked)}
                className="w-4 h-4 accent-orange-400"
              />
              <span className="text-zinc-300 text-sm">{state.removeBackground ? 'Enabled' : 'Disabled'}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
