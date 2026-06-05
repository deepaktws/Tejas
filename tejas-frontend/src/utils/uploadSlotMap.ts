import type { ModelOutputFile, UploadApiResponse } from './api'
import {
  downloadGradeList,
  downloadHeatChem,
  downloadHeatQueryAll,
  downloadHeatQuerySchedule,
  downloadScrapChem,
  downloadScrapDataInventory,
  uploadGradeList,
  uploadHeatChem,
  uploadHeatQueryAll,
  uploadHeatQuerySchedule,
  uploadScrapChem,
  uploadScrapDataInventory,
} from './api'
import type { DownloadResult } from './api'

export type SlotUploadContext = {
  heatQueryAllRecordId?: number
  heatChemRecordId?: number
}

export type SlotUploadFn = (
  file: File,
  context: SlotUploadContext,
) => Promise<UploadApiResponse>

const slotUploadFns: Record<string, SlotUploadFn> = {
  'heat-query': (file, ctx) =>
    uploadHeatQueryAll(file, ctx.heatChemRecordId),
  'heat-query-chem': (file, ctx) =>
    uploadHeatChem(file, ctx.heatQueryAllRecordId),
  'scrap-chem-file': (file) => uploadScrapChem(file),
  'heat-query-scheduled-heats-file': (file) => uploadHeatQuerySchedule(file),
  'scrap-data-daily-inventory-file': (file) => uploadScrapDataInventory(file),
  'met-grade-list-file': (file) => uploadGradeList(file),
}

export function getSlotUploadFn(slotId: string): SlotUploadFn | undefined {
  return slotUploadFns[slotId]
}

export function recordIdFromUploadResponse(response: UploadApiResponse): number {
  const data = response.data
  if (data && typeof data === 'object' && 'record' in data && data.record?.id) {
    return data.record.id
  }
  if (data && typeof data === 'object' && 'id' in data && typeof data.id === 'number') {
    return data.id
  }
  throw new Error('Upload response missing record id')
}

export function outputFileFromUploadResponse(
  response: UploadApiResponse,
): ModelOutputFile | undefined {
  const data = response.data
  if (!data || typeof data !== 'object' || !('modelResult' in data)) return undefined
  return data.modelResult?.output_file
}

/** Step id → download handlers (step 1 has two files) */
export const STEP_DOWNLOAD_FNS: Record<
  string,
  Array<() => Promise<DownloadResult>>
> = {
  'heat-query-all': [downloadHeatQueryAll, downloadHeatChem],
  'scrap-chem-file': [downloadScrapChem],
  'heat-query-scheduled-heats-file': [downloadHeatQuerySchedule],
  'scrap-data-daily-inventory-file': [downloadScrapDataInventory],
  'met-grade-list-file': [downloadGradeList],
}
