import type { GenerationStatus } from '../state/useAppState'

interface GenerateButtonProps {
  disabled: boolean
  status: GenerationStatus
  onClick: () => void
}

const STATUS_LABELS: Record<GenerationStatus, string> = {
  idle: 'Generate Pet',
  'removing-bg': 'Removing background…',
  pixelating: 'Pixelating…',
  assembling: 'Assembling sprite sheet…',
  done: 'Regenerate Pet',
  error: 'Try Again',
}

export function GenerateButton({ disabled, status, onClick }: GenerateButtonProps) {
  const isLoading = ['removing-bg', 'pixelating', 'assembling'].includes(status)

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="px-8 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-mono font-semibold rounded-xl transition-colors text-lg"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          {STATUS_LABELS[status]}
        </span>
      ) : STATUS_LABELS[status]}
    </button>
  )
}
