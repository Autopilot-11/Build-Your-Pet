import JSZip from 'jszip'

export async function packagePet(
  petJsonString: string,
  spritesheetBlob: Blob,
  petId: string
): Promise<Blob> {
  const zip = new JSZip()
  const folder = zip.folder(petId)!
  folder.file('pet.json', petJsonString)
  folder.file('spritesheet.webp', spritesheetBlob)
  return zip.generateAsync({ type: 'blob' })
}
