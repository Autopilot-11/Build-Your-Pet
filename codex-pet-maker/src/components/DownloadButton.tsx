interface DownloadButtonProps {
  visible: boolean
  onClick: () => void
}

export function DownloadButton({ visible, onClick }: DownloadButtonProps) {
  if (!visible) return null

  return (
    <button
      onClick={onClick}
      className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-mono font-semibold rounded-xl transition-colors text-lg"
    >
      Download pet.zip
    </button>
  )
}
