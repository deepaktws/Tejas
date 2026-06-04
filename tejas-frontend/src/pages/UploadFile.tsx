import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import { useMemo, useState } from 'react'
import { UploadSidebar } from '../components/upload/UploadSidebar'
import { UploadStep } from '../components/upload/UploadStep'
import { UPLOAD_STEPS } from '../components/upload/uploadStepsConfig'

type StepFiles = Record<string, File | null>

function formatYesterdayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function UploadFile() {
  const [stepFiles, setStepFiles] = useState<StepFiles>(() =>
    Object.fromEntries(UPLOAD_STEPS.map((step) => [step.id, null])),
  )

  const yesterdayLabel = useMemo(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return formatYesterdayLabel(yesterday)
  }, [])

  const isStepEnabled = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true
    const previousStep = UPLOAD_STEPS.find((s) => s.stepNumber === stepNumber - 1)
    return previousStep ? stepFiles[previousStep.id] !== null : false
  }

  const requiredStepsUploaded = UPLOAD_STEPS.filter((s) => !s.optional).every(
    (step) => stepFiles[step.id] !== null,
  )

  const handleFileSelect = (stepId: string, file: File | null) => {
    setStepFiles((prev) => ({ ...prev, [stepId]: file }))
  }

  const handleRunPlanner = () => {
    if (!requiredStepsUploaded) return
    // TODO: wire to planner API when available
    console.log(
      'Run planner',
      Object.fromEntries(
        UPLOAD_STEPS.map((s) => [s.id, stepFiles[s.id]?.name ?? '(yesterday fallback)']),
      ),
    )
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

          <div className="mt-8 gap-3 flex flex-col relative z-10 ">
      <div className="absolute top-10 left-8 bg-brand-primary z-1 h-[calc(100%-140px)] w-0.5"></div>
            {UPLOAD_STEPS.map((step, index) => (
              <UploadStep
                key={step.id}
                stepNumber={step.stepNumber}
                title={step.title}
                optional={step.optional}
                outputNote={step.outputNote}
                footerNote={step.footerNote}
                file={stepFiles[step.id]}
                onFileSelect={(file) => handleFileSelect(step.id, file)}
                disabled={!isStepEnabled(step.stepNumber)}
              />
            ))}
          </div>

          <div className="mt-2 flex items-start gap-2 rounded-lg border border-border-default px-4 py-3 text-sm text-brand-danger font-bold">
            <InfoOutlinedIcon
              className="shrink-0"
              sx={{ fontSize: 18 }}
              aria-hidden
            />
            Note:
            <span className="text-text-primary font-normal">
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
