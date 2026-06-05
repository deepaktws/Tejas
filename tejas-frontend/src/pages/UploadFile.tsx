import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import { useCallback, useMemo, useState } from 'react'
import { UploadSidebar } from '../components/upload/UploadSidebar'
import { UploadStep } from '../components/upload/UploadStep'
import {
  UPLOAD_STEPS,
  createEmptyUploadStatus,
  createEmptyStepFiles,
  getFileSlotIds,
  isStepEnabledByUpload,
  areRequiredSlotsUploaded,
  type SlotUploadState,
} from '../components/upload/uploadStepsConfig'
import {
  downloadAndSave,
  downloadModelOutputFile,
  runModelPlanner,
  saveBlobAsFile,
  type ModelOutputFile,
} from '../utils/api'
import {
  STEP_DOWNLOAD_FNS,
  getSlotUploadFn,
  outputFileFromUploadResponse,
  recordIdFromUploadResponse,
  type SlotUploadContext,
} from '../utils/uploadSlotMap'

function formatYesterdayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function UploadFile() {
  const [stepFiles, setStepFiles] = useState(createEmptyStepFiles)
  const [uploadStatus, setUploadStatus] = useState(createEmptyUploadStatus)
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [recordIds, setRecordIds] = useState<{
    heatQueryAllRecordId?: number
    heatChemRecordId?: number
  }>({})
  const [downloadingStepId, setDownloadingStepId] = useState<string | null>(null)
  const [isRunningPlanner, setIsRunningPlanner] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [step1OutputFile, setStep1OutputFile] = useState<ModelOutputFile | null>(null)

  const yesterdayLabel = useMemo(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return formatYesterdayLabel(yesterday)
  }, [])

  const plannerReady = areRequiredSlotsUploaded(uploadStatus)

  const setSlotUploadState = useCallback((slotId: string, state: SlotUploadState) => {
    setUploadStatus((prev) => ({ ...prev, [slotId]: state }))
  }, [])

  const uploadSlotFile = useCallback(
    async (slotId: string, file: File) => {
      const uploadFn = getSlotUploadFn(slotId)
      if (!uploadFn) {
        setUploadErrors((prev) => ({
          ...prev,
          [slotId]: `No upload handler for slot "${slotId}"`,
        }))
        setSlotUploadState(slotId, 'error')
        return
      }

      setPageError(null)
      setUploadErrors((prev) => {
        const next = { ...prev }
        delete next[slotId]
        return next
      })
      setSlotUploadState(slotId, 'uploading')

      const context: SlotUploadContext = {
        heatQueryAllRecordId: recordIds.heatQueryAllRecordId,
        heatChemRecordId: recordIds.heatChemRecordId,
      }

      try {
        const response = await uploadFn(file, context)
        const id = recordIdFromUploadResponse(response)

        if (slotId === 'heat-query') {
          setRecordIds((prev) => ({ ...prev, heatQueryAllRecordId: id }))
        } else if (slotId === 'heat-query-chem') {
          setRecordIds((prev) => ({ ...prev, heatChemRecordId: id }))
        }

        const outputFile = outputFileFromUploadResponse(response)
        if (outputFile) {
          setStep1OutputFile(outputFile)
        }

        setSlotUploadState(slotId, 'success')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setUploadErrors((prev) => ({ ...prev, [slotId]: message }))
        setSlotUploadState(slotId, 'error')
      }
    },
    [recordIds.heatChemRecordId, recordIds.heatQueryAllRecordId, setSlotUploadState],
  )

  const handleFileSelect = useCallback(
    (slotId: string, file: File | null) => {
      setStepFiles((prev) => ({ ...prev, [slotId]: file }))

      if (!file) {
        setSlotUploadState(slotId, 'idle')
        setUploadErrors((prev) => {
          const next = { ...prev }
          delete next[slotId]
          return next
        })
        if (slotId === 'heat-query' || slotId === 'heat-query-chem') {
          setStep1OutputFile(null)
          if (slotId === 'heat-query') {
            setRecordIds((prev) => ({ ...prev, heatQueryAllRecordId: undefined }))
          }
          if (slotId === 'heat-query-chem') {
            setRecordIds((prev) => ({ ...prev, heatChemRecordId: undefined }))
          }
        }
        return
      }

      void uploadSlotFile(slotId, file)
    },
    [setSlotUploadState, uploadSlotFile],
  )

  const handleRunPlanner = async () => {
    if (!plannerReady || isRunningPlanner) return

    setPageError(null)
    setIsRunningPlanner(true)
    try {
      const { blob, filename } = await runModelPlanner()
      saveBlobAsFile(blob, filename)
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to run planner')
    } finally {
      setIsRunningPlanner(false)
    }
  }

  const handleDownloadStep1Output = () => {
    if (!step1OutputFile) {
      setPageError('Upload both Step 1 files to generate the scrap chem output.')
      return
    }
    setPageError(null)
    downloadModelOutputFile(step1OutputFile)
  }

  const handleDownloadYesterday = async (stepId: string) => {
    const downloadFns = STEP_DOWNLOAD_FNS[stepId]
    if (!downloadFns?.length) {
      setPageError(`No download handler for step "${stepId}"`)
      return
    }

    setPageError(null)
    setDownloadingStepId(stepId)
    try {
      for (const downloadFn of downloadFns) {
        await downloadAndSave(downloadFn)
      }
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloadingStepId(null)
    }
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

          {pageError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-brand-danger/30 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger"
            >
              {pageError}
            </p>
          )}

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
                uploadStatus={uploadStatus}
                uploadErrors={uploadErrors}
                onFileSelect={handleFileSelect}
                disabled={!isStepEnabledByUpload(step.stepNumber, uploadStatus)}
                outputDownloadFilename={
                  step.id === 'heat-query-all' ? step1OutputFile?.filename ?? null : null
                }
                onOutputDownload={
                  step.id === 'heat-query-all' ? handleDownloadStep1Output : undefined
                }
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
              disabled={!plannerReady || isRunningPlanner}
              onClick={() => void handleRunPlanner()}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-text-inverse transition-opacity',
                'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-border-selected',
                plannerReady && !isRunningPlanner
                  ? 'cursor-pointer bg-linear-to-t from-green-700 to-green-500 hover:opacity-90'
                  : 'cursor-not-allowed bg-text-muted',
              ].join(' ')}
            >
              <PlayCircleOutlinedIcon sx={{ fontSize: 24 }} aria-hidden />
              {isRunningPlanner ? 'Running planner…' : 'Run Planner & Download Daily Plan'}
            </button>
            <p className="mt-3 text-sm text-text-secondary">
              All required files must be uploaded successfully to enable this button.
            </p>
          </div>
        </main>

        <UploadSidebar
          steps={UPLOAD_STEPS}
          yesterdayDateLabel={yesterdayLabel}
          downloadingStepId={downloadingStepId}
          onDownloadYesterday={(stepId) => void handleDownloadYesterday(stepId)}
        />
      </div>
    </div>
  )
}

export default UploadFile
