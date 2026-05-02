import { saveAs } from 'file-saver'
import { Header } from './components/Header'
import { Uploader } from './components/Uploader'
import { ConfigPanel } from './components/ConfigPanel'
import { PreviewPanel } from './components/PreviewPanel'
import { GenerateButton } from './components/GenerateButton'
import { DownloadButton } from './components/DownloadButton'
import { InstallInstructions } from './components/InstallInstructions'
import { Footer } from './components/Footer'
import { useAppState } from './state/useAppState'
import { removeBackground, imageToCell } from './lib/pixelate'
import { generateAllFrames, buildSpriteSheet } from './lib/atlas'
import { buildPetJson } from './lib/petJson'
import { packagePet } from './lib/zipPackage'

function App() {
  const { state, dispatch, petId } = useAppState()

  function handleFile(file: File) {
    const url = URL.createObjectURL(file)
    dispatch({ type: 'SET_FILE', file, previewUrl: url })
  }

  function handleConfigChange(field: string, value: string | number | boolean) {
    switch (field) {
      case 'petName': dispatch({ type: 'SET_NAME', name: value as string }); break
      case 'description': dispatch({ type: 'SET_DESCRIPTION', description: value as string }); break
      case 'pixelSize': dispatch({ type: 'SET_PIXEL_SIZE', size: value as number }); break
      case 'paletteSize': dispatch({ type: 'SET_PALETTE_SIZE', size: value as number }); break
      case 'removeBackground': dispatch({ type: 'SET_REMOVE_BACKGROUND', value: value as boolean }); break
    }
  }

  async function handleGenerate() {
    if (!state.uploadedFile) return

    try {
      let blob: Blob

      if (state.removeBackground) {
        dispatch({ type: 'SET_STATUS', status: 'removing-bg' })
        blob = await removeBackground(state.uploadedFile)
      } else {
        blob = state.uploadedFile
      }

      dispatch({ type: 'SET_STATUS', status: 'pixelating' })
      const cell = await imageToCell(blob, {
        pixelSize: state.pixelSize,
        paddingPct: 0.1,
      })

      dispatch({ type: 'SET_STATUS', status: 'assembling' })
      const frames = generateAllFrames(cell)
      const spritesheet = await buildSpriteSheet(frames)

      dispatch({ type: 'SET_RESULT', cell, spritesheet })
    } catch (err) {
      dispatch({ type: 'SET_STATUS', status: 'error', error: String(err) })
    }
  }

  async function handleDownload() {
    if (!state.spritesheetBlob) return
    const petJson = buildPetJson({ id: petId, name: state.petName, description: state.description })
    const zipBlob = await packagePet(petJson, state.spritesheetBlob, petId)
    saveAs(zipBlob, `${petId}.zip`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Header />
        <div className="space-y-8">
          <Uploader onFile={handleFile} />

          {state.uploadedFile && (
            <ConfigPanel state={state} onChange={handleConfigChange} />
          )}

          <PreviewPanel
            originalUrl={state.originalPreviewUrl}
            spritesheetBlob={state.spritesheetBlob}
          />

          {state.errorMessage && (
            <p className="text-red-400 text-sm text-center">{state.errorMessage}</p>
          )}

          <div className="flex flex-col items-center gap-4">
            <GenerateButton
              disabled={!state.uploadedFile}
              status={state.status}
              onClick={handleGenerate}
            />
            <DownloadButton
              visible={state.status === 'done' && !!state.spritesheetBlob}
              onClick={handleDownload}
            />
          </div>

          <InstallInstructions />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
