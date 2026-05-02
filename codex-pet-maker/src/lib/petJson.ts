import { ANIMATIONS, ATLAS_WIDTH, ATLAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT, COLUMNS, ROWS } from './constants'

export interface PetConfig {
  id: string
  name: string
  description: string
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function buildPetJson(config: PetConfig): string {
  const schema = {
    id: config.id,
    name: config.name,
    description: config.description,
    version: '1.0.0',
    spritesheet: 'spritesheet.webp',
    atlas: {
      width: ATLAS_WIDTH,
      height: ATLAS_HEIGHT,
      cell_width: CELL_WIDTH,
      cell_height: CELL_HEIGHT,
      columns: COLUMNS,
      rows: ROWS,
    },
    animations: ANIMATIONS,
  }
  return JSON.stringify(schema, null, 2)
}
