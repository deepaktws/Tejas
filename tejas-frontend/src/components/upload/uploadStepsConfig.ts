export type UploadStepConfig = {
  id: string
  stepNumber: number
  title: string
  optional?: boolean
  outputNote?: string | null
  footerNote?: string | null
  /** When a step needs more than one file (e.g. step 1). Defaults to [id]. */
  fileSlotIds?: string[]
}

export const UPLOAD_STEPS: UploadStepConfig[] = [
  {
    id: 'heat-query-all',
    stepNumber: 1,
    title: 'heat query all and heat query chem file',
    optional: false,
    outputNote: 'Output of Step 1: Scrap chem file',
    footerNote: null,
    fileSlotIds: ['heat-query', 'heat-query-chem'],
  },
  {
    id: 'scrap-chem-file',
    stepNumber: 2,
    title: 'scrap chem file',
    optional: false,
    outputNote: null,
    footerNote: null,
  },
  {
    id: 'heat-query-scheduled-heats-file',
    stepNumber: 3,
    title: 'heat query (scheduled heats) file',
    optional: false,
    outputNote: null,
    footerNote: null,
  },
  {
    id: 'scrap-data-daily-inventory-file',
    stepNumber: 4,
    title: 'scrap data daily inventory',
    optional: false,
    outputNote: null,
    footerNote: null,
  },
  {
    id: 'met-grade-list-file',
    stepNumber: 5,
    title: 'met grade list',
    optional: true,
    footerNote: "If not uploaded, yesterday's file will be used.",
    outputNote: null,
  },
]

export function getFileSlotIds(step: UploadStepConfig): string[] {
  return step.fileSlotIds ?? [step.id]
}

export function getAllFileSlotIds(steps: UploadStepConfig[] = UPLOAD_STEPS): string[] {
  return steps.flatMap(getFileSlotIds)
}

export function createEmptyStepFiles(steps: UploadStepConfig[] = UPLOAD_STEPS): Record<string, File | null> {
  return Object.fromEntries(getAllFileSlotIds(steps).map((slotId) => [slotId, null]))
}

export function isStepComplete(
  step: UploadStepConfig,
  files: Record<string, File | null>,
): boolean {
  return getFileSlotIds(step).every((slotId) => files[slotId] !== null)
}

export function isStepEnabled(
  stepNumber: number,
  files: Record<string, File | null>,
  steps: UploadStepConfig[] = UPLOAD_STEPS,
): boolean {
  if (stepNumber === 1) return true
  const previousStep = steps.find((s) => s.stepNumber === stepNumber - 1)
  return previousStep ? isStepComplete(previousStep, files) : false
}

export function areRequiredFilesUploaded(
  files: Record<string, File | null>,
  steps: UploadStepConfig[] = UPLOAD_STEPS,
): boolean {
  return steps.filter((s) => !s.optional).every((step) => isStepComplete(step, files))
}

export const YESTERDAY_FILES = UPLOAD_STEPS.map((step) => ({
  id: step.id,
  name: step.title,
}))

export const ACCEPTED_FILE_TYPES = '.xlsx,.xls,.csv'
