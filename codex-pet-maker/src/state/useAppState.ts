import { useReducer } from 'react'
import { slugify } from '../lib/petJson'

export type GenerationStatus = 'idle' | 'removing-bg' | 'pixelating' | 'assembling' | 'done' | 'error'

export interface AppState {
  uploadedFile: File | null
  petName: string
  description: string
  pixelSize: number
  paletteSize: number
  removeBackground: boolean
  status: GenerationStatus
  errorMessage: string
  processedCell: ImageData | null
  spritesheetBlob: Blob | null
  originalPreviewUrl: string | null
}

type Action =
  | { type: 'SET_FILE'; file: File; previewUrl: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_DESCRIPTION'; description: string }
  | { type: 'SET_PIXEL_SIZE'; size: number }
  | { type: 'SET_PALETTE_SIZE'; size: number }
  | { type: 'SET_REMOVE_BACKGROUND'; value: boolean }
  | { type: 'SET_STATUS'; status: GenerationStatus; error?: string }
  | { type: 'SET_RESULT'; cell: ImageData; spritesheet: Blob }

const initialState: AppState = {
  uploadedFile: null,
  petName: 'My Pet',
  description: 'A friendly companion',
  pixelSize: 4,
  paletteSize: 16,
  removeBackground: true,
  status: 'idle',
  errorMessage: '',
  processedCell: null,
  spritesheetBlob: null,
  originalPreviewUrl: null,
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, uploadedFile: action.file, originalPreviewUrl: action.previewUrl, processedCell: null, spritesheetBlob: null, status: 'idle' }
    case 'SET_NAME':
      return { ...state, petName: action.name }
    case 'SET_DESCRIPTION':
      return { ...state, description: action.description }
    case 'SET_PIXEL_SIZE':
      return { ...state, pixelSize: action.size }
    case 'SET_PALETTE_SIZE':
      return { ...state, paletteSize: action.size }
    case 'SET_REMOVE_BACKGROUND':
      return { ...state, removeBackground: action.value }
    case 'SET_STATUS':
      return { ...state, status: action.status, errorMessage: action.error ?? '' }
    case 'SET_RESULT':
      return { ...state, processedCell: action.cell, spritesheetBlob: action.spritesheet, status: 'done' }
    default:
      return state
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const petId = slugify(state.petName) || 'my-pet'

  return { state, dispatch, petId }
}
