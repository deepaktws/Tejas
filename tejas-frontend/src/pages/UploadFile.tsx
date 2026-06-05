import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import { useMemo, useState } from 'react'
import { UploadSidebar } from '../components/upload/UploadSidebar'
import { UploadStep } from '../components/upload/UploadStep'
import {
  UPLOAD_STEPS,
  areRequiredFilesUploaded,
  createEmptyStepFiles,
  createEmptyUploadStatuses,
  getFileSlotIds,
  isStepEnabled,
} from '../components/upload/uploadStepsConfig'
import uploadService from '../service/upload.service'
import { getUploadRecordId, tryDownloadModelOutput } from '../utils/FileRead'

function formatYesterdayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function UploadFile() {
  const [stepFiles, setStepFiles] = useState(createEmptyStepFiles)
  const [uploadStatuses, setUploadStatuses] = useState(createEmptyUploadStatuses)
  const [pairedId, setPairedId] = useState<number | null>(null)


  const yesterdayLabel = useMemo(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return formatYesterdayLabel(yesterday)
  }, [])

  const requiredStepsUploaded = areRequiredFilesUploaded(uploadStatuses)

  const setSlotUploadStatus = (slotId: string, status: 'idle' | 'uploading' | 'uploaded' | 'error') => {
    setUploadStatuses((prev) => ({ ...prev, [slotId]: status }))
  }

  const handleFileSelect = async (slotId: string, file: File | null) => {
    if (!file) {
      setStepFiles((prev) => ({ ...prev, [slotId]: null }))
      setSlotUploadStatus(slotId, 'idle')
      return
    }

    setStepFiles((prev) => ({ ...prev, [slotId]: file }))
    setSlotUploadStatus(slotId, 'uploading')

    const formData = new FormData()
    formData.append('file', file)
    if (pairedId !== null) {
      formData.append('pairedId', pairedId.toString())
    }

    try {
      switch (slotId) {
        case 'heat-query-all': {
          const response = await uploadService.uploadHeatQueryAll(formData)
          const recordId = getUploadRecordId(response?.data)
          if (recordId != null) setPairedId(recordId)
          tryDownloadModelOutput(response?.data)
          break
        }
        case 'heat-query-chem': {
          const response = await uploadService.uploadHeatChem(formData)
          const recordId = getUploadRecordId(response?.data)
          if (recordId != null) setPairedId(recordId)
          tryDownloadModelOutput(response?.data)
          break
        }
        case 'scrap-chem':
          await uploadService.uploadScrapChem(formData)
          break
        case 'heat-query-scheduled-heats':
          await uploadService.uploadHeatQuerySchedule(formData)
          break
        case 'scrap-data-daily-inventory':
          await uploadService.uploadScrapDataInventory(formData)
          break
        case 'met-grade-list':
          await uploadService.uploadGradeList(formData)
          break
      }
      setSlotUploadStatus(slotId, 'uploaded')
    } catch {
      setSlotUploadStatus(slotId, 'error')
    }
  }

  const handleRunPlanner = () => {
    if (!requiredStepsUploaded) return
    // TODO: wire to planner API when available
    console.log('Run planner', stepFiles)
  }

  const handleDownloadYesterday = (stepId: string) => {
    // TODO: wire to download API when available
    console.log('Download yesterday file', stepId)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background px-7 py-6">
      <div className="mx-auto flex flex-col gap-8 lg:flex-row lg:items-start">
        <main className="min-w-0 flex-1">
          <header>
            <h1 className="text-2xl font-bold text-text-heading">
              Upload Files (One by One in Order)
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Please upload the files in the given sequence. You can download yesterday&apos;s
              files from the right.
            </p>
          </header>

          <div className="relative z-10 mt-8 flex flex-col gap-3">
            <div className="absolute top-10 left-8 z-1 h-[calc(100%-140px)] w-0.5 bg-brand-primary" />
            {UPLOAD_STEPS.map((step) => (
              <UploadStep
                key={step.id}
                stepNumber={step.stepNumber}
                title={step.title}
                optional={step.optional}
                outputNote={step.outputNote}
                footerNote={step.footerNote}
                fileSlotIds={getFileSlotIds(step)}
                files={stepFiles}
                uploadStatuses={uploadStatuses}
                onFileSelect={handleFileSelect}
                disabled={!isStepEnabled(step.stepNumber, uploadStatuses)}
              />
            ))}
          </div>

          <div className="mt-2 flex items-start gap-2 rounded-lg border border-border-default px-4 py-3 text-sm font-bold text-brand-danger">
            <InfoOutlinedIcon className="shrink-0" sx={{ fontSize: 18 }} aria-hidden />
            Note:
            <span className="font-normal text-text-primary">
              Upload files one by one in the above order for accurate scrap mix planning.
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              type="button"
              disabled={!requiredStepsUploaded}
              onClick={handleRunPlanner}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-text-inverse transition-opacity',
                'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-border-selected',
                requiredStepsUploaded
                  ? 'cursor-pointer bg-linear-to-t from-green-700 to-green-500 hover:opacity-90'
                  : 'cursor-not-allowed bg-text-muted',
              ].join(' ')}
            >
              <PlayCircleOutlinedIcon sx={{ fontSize: 24 }} aria-hidden />
              Run Planner & Download Daily Plan
            </button>
            <p className="mt-3 text-sm text-text-secondary">
              All required files must be uploaded to enable this button.
            </p>
          </div>
        </main>

        <UploadSidebar
          steps={UPLOAD_STEPS}
          yesterdayDateLabel={yesterdayLabel}
          onDownloadYesterday={handleDownloadYesterday}
        />
      </div>
    </div>
  )
}

export default UploadFile
