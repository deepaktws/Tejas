export interface ModelOutputFile {
  filename: string
  content_base64: string
  mime_type: string
}

export interface HeatUploadResponseData {
  id?: number
  record?: { id: number }
  modelResult?: {
    output_file?: ModelOutputFile
  }
}

export function saveBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Decode base64 `output_file` from heat-chem / model upload responses and save locally */
export function downloadModelOutputFile(outputFile: ModelOutputFile): void {
  const binary = atob(outputFile.content_base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: outputFile.mime_type })
  saveBlobAsFile(blob, outputFile.filename)
}

export function getUploadRecordId(
  data: HeatUploadResponseData | undefined
): number | undefined {
  if (!data) return undefined
  if (data.record?.id != null) return data.record.id
  if (data.id != null) return data.id
  return undefined
}

/** When both heat files are paired, the API may include a model Excel in `modelResult.output_file`. */
export function tryDownloadModelOutput(data: HeatUploadResponseData | undefined): void {
  const outputFile = data?.modelResult?.output_file
  if (outputFile?.content_base64) {
    downloadModelOutputFile(outputFile)
  }
}
