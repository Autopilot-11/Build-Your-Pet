import { useRef, useState } from 'react'

interface UploaderProps {
  onFile: (file: File) => void
}

const MAX_SIZE = 10 * 1024 * 1024

export function Uploader({ onFile }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      setError('Only PNG and JPG files are supported.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('File must be under 10 MB.')
      return
    }
    setError('')
    onFile(file)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="font-mono text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
        Step 1 — Upload
      </h2>
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-orange-400 bg-zinc-800' : 'border-zinc-700 hover:border-zinc-500'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      >
        <p className="text-zinc-300 text-lg">Drag image here or click to browse</p>
        <p className="text-zinc-500 text-sm mt-1">PNG or JPG, up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
    </div>
  )
}
