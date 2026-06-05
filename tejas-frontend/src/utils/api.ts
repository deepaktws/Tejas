const API_V1 = '/api/v1'

/** Mirrors tejas-backend `src/constants/route.ts` upload/download paths */
export const API_ROUTES = {
  health: `${API_V1}/health`,

  upload: {
    heatQueryAll: `${API_V1}/upload/heat-query-all`,
    gradeList: `${API_V1}/upload/grade-list`,
    scrapDataInventory: `${API_V1}/upload/scrap-data-inventory`,
    heatQuerySchedule: `${API_V1}/upload/heat-query-schedule`,
    scrapChem: `${API_V1}/upload/scrap-chem`,
    heatChem: `${API_V1}/upload/heat-chem`,
  },

  model: {
    run: `${API_V1}/model/run_model`,
  },

  download: {
    heatQueryAll: `${API_V1}/download/heat-query-all`,
    gradeList: `${API_V1}/download/grade-list`,
    scrapDataInventory: `${API_V1}/download/scrap-data-inventory`,
    heatQuerySchedule: `${API_V1}/download/heat-query-schedule`,
    scrapChem: `${API_V1}/download/scrap-chem`,
    heatChem: `${API_V1}/download/heat-chem`,
  },
} as const

export type UploadRecord = {
  id: number
  filepath: string
  upload_type: string
  created_at: string
  is_deleted: boolean
}

export type ModelOutputFile = {
  content_base64: string
  filename: string
  mime_type: string
}

export type UploadApiResponse = {
  message: string
  data: UploadRecord | { record: UploadRecord; modelResult?: { output_file?: ModelOutputFile } }
}

export type DownloadResult = {
  blob: Blob
  filename: string
}

function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
  return base.replace(/\/$/, '')
}

function buildUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`
}

async function parseErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) return body.message
    } catch {
      /* fall through */
    }
  }
  return res.statusText || `Request failed (${res.status})`
}

function getFilenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1])
  const quotedMatch = header.match(/filename="([^"]+)"/i)
  if (quotedMatch?.[1]) return quotedMatch[1]
  const plainMatch = header.match(/filename=([^;]+)/i)
  if (plainMatch?.[1]) return plainMatch[1].trim()
  return null
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

async function uploadFile(
  path: string,
  file: File,
  options?: { pairedId?: number },
): Promise<UploadApiResponse> {
  const formData = new FormData()
  formData.append('file', file)
  if (options?.pairedId !== undefined) {
    formData.append('pairedId', String(options.pairedId))
  }

  const res = await fetch(buildUrl(path), {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }

  return res.json() as Promise<UploadApiResponse>
}

async function downloadFile(path: string): Promise<DownloadResult> {
  const res = await fetch(buildUrl(path), { method: 'GET' })

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }

  const blob = await res.blob()
  const filename =
    getFilenameFromContentDisposition(res.headers.get('content-disposition')) ??
    'download'

  return { blob, filename }
}

// --- Health ---

export async function checkApiHealth(): Promise<{ status: string; timestamp: string }> {
  const res = await fetch(buildUrl(API_ROUTES.health))
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }
  return res.json() as Promise<{ status: string; timestamp: string }>
}

// --- Upload (POST multipart, field name: `file`) ---

export function uploadHeatQueryAll(file: File, pairedId?: number) {
  return uploadFile(API_ROUTES.upload.heatQueryAll, file, { pairedId })
}

export function uploadGradeList(file: File) {
  return uploadFile(API_ROUTES.upload.gradeList, file)
}

export function uploadScrapDataInventory(file: File) {
  return uploadFile(API_ROUTES.upload.scrapDataInventory, file)
}

export function uploadHeatQuerySchedule(file: File) {
  return uploadFile(API_ROUTES.upload.heatQuerySchedule, file)
}

export function uploadScrapChem(file: File) {
  return uploadFile(API_ROUTES.upload.scrapChem, file)
}

export function uploadHeatChem(file: File, pairedId?: number) {
  return uploadFile(API_ROUTES.upload.heatChem, file, { pairedId })
}

// --- Download (GET, latest file per type) ---

export function downloadHeatQueryAll() {
  return downloadFile(API_ROUTES.download.heatQueryAll)
}

export function downloadGradeList() {
  return downloadFile(API_ROUTES.download.gradeList)
}

export function downloadScrapDataInventory() {
  return downloadFile(API_ROUTES.download.scrapDataInventory)
}

export function downloadHeatQuerySchedule() {
  return downloadFile(API_ROUTES.download.heatQuerySchedule)
}

export function downloadScrapChem() {
  return downloadFile(API_ROUTES.download.scrapChem)
}

export function downloadHeatChem() {
  return downloadFile(API_ROUTES.download.heatChem)
}

/** Fetches a download and triggers a browser save dialog */
export async function downloadAndSave(
  downloadFn: () => Promise<DownloadResult>,
): Promise<void> {
  const { blob, filename } = await downloadFn()
  saveBlobAsFile(blob, filename)
}

// --- Model (GET, planner output CSV) ---

export async function runModelPlanner(): Promise<DownloadResult> {
  const res = await fetch(buildUrl(API_ROUTES.model.run), { method: 'GET' })

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }

  const blob = await res.blob()
  const filename =
    getFilenameFromContentDisposition(res.headers.get('content-disposition')) ??
    'model-output.csv'

  return { blob, filename }
}
