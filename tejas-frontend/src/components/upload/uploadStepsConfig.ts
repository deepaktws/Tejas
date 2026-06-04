export type UploadStepConfig = {
  id: string
  stepNumber: number
  title: string
  optional?: boolean
  outputNote?: string
  footerNote?: string
}

export const UPLOAD_STEPS: UploadStepConfig[] = [
  {
    id: 'heat-query-all',
    stepNumber: 1,
    title: 'heat query all and heat query chem file',
    outputNote: 'Output of Step 1: Scrap chem file',
  },
  {
    id: 'scrap-chem-file',
    stepNumber: 2,
    title: 'scrap chem file',
  },
  {
    id: 'heat-query-scheduled-heats-file',
    stepNumber: 3,
    title: 'heat query (scheduled heats) file',
  },
  {
    id: 'scrap-data-daily-inventory-file',
    stepNumber: 4,
    title: 'scrap data daily inventory',
  },
  {
    id: 'met-grade-list-file',
    stepNumber: 5,
    title: 'met grade list',
    optional: true,
    footerNote: "If not uploaded, yesterday's file will be used.",
  },
]

export const YESTERDAY_FILES = UPLOAD_STEPS.map((step) => ({
  id: step.id,
  name: step.title,
}))

export const ACCEPTED_FILE_TYPES = '.xlsx,.xls,.csv'
