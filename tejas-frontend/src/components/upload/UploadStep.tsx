import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { type ChangeEvent, useId, useRef } from 'react'
import type { SlotUploadState } from './uploadStepsConfig'

type UploadFileInputProps = {
  disabled?: boolean
  file: File | null
  uploadState: SlotUploadState
  uploadError?: string
  onFileChange: (file: File | null) => void
}

function uploadStateLabel(state: SlotUploadState, hasFile: boolean): string {
  if (state === 'uploading') return 'Uploading…'
  if (state === 'success') return 'Uploaded'
  if (state === 'error') return 'Upload failed'
  return hasFile ? 'Pending upload' : 'Not uploaded'
}

function UploadFileInput({
  disabled = false,
  file,
  uploadState,
  uploadError,
  onFileChange,
}: UploadFileInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const isUploaded = uploadState === 'success'
  const isBusy = uploadState === 'uploading'

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    onFileChange(selected)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label
        htmlFor={disabled ? undefined : inputId}
        className={[
          'flex min-w-[200px] flex-row items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-2',
          disabled
            ? 'cursor-not-allowed border-border-default opacity-60'
            : 'cursor-pointer border-border-default bg-surface-card hover:border-brand-accent',
        ].join(' ')}
      >
        <FileUploadOutlinedIcon className="text-text-muted" sx={{ fontSize: 28 }} aria-hidden />
        <div className="flex flex-col items-start justify-center">
          <span className="rounded-md text-sm font-medium text-text-secondary">Choose File</span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            disabled={disabled || isBusy}
            onChange={handleInputChange}
          />
          <p className="mt-2 max-w-[180px] truncate text-xs text-text-primary">
            {file?.name ?? 'No file chosen'}
          </p>
        </div>
      </label>

      <div className="flex flex-col gap-0.5 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={[
              'size-2 rounded-full',
              isUploaded
                ? 'bg-border-selected'
                : uploadState === 'error'
                  ? 'bg-brand-danger'
                  : 'bg-text-muted',
            ].join(' ')}
            aria-hidden
          />
          <span
            className={
              isUploaded
                ? 'font-medium text-border-selected'
                : uploadState === 'error'
                  ? 'font-medium text-brand-danger'
                  : 'text-text-secondary'
            }
          >
            {uploadStateLabel(uploadState, file !== null)}
          </span>
        </div>
        {uploadError && (
          <p className="max-w-[220px] text-xs text-brand-danger">{uploadError}</p>
        )}
      </div>
    </div>
  )
}

export type UploadStepProps = {
  stepNumber: number
  title: string
  optional?: boolean
  outputNote?: string | null
  footerNote?: string | null
  fileSlotIds: string[]
  files: Record<string, File | null>
  uploadStatus: Record<string, SlotUploadState>
  uploadErrors: Record<string, string>
  onFileSelect: (slotId: string, file: File | null) => void
  disabled?: boolean
  outputDownloadFilename?: string | null
  onOutputDownload?: () => void
}

export function UploadStep({
  stepNumber,
  title,
  optional = false,
  outputNote,
  footerNote,
  fileSlotIds,
  files,
  uploadStatus,
  uploadErrors,
  onFileSelect,
  disabled = false,
  outputDownloadFilename = null,
  onOutputDownload,
}: UploadStepProps) {
  const outputReady = Boolean(outputDownloadFilename && onOutputDownload)
  return (
    <div className="relative flex gap-4 rounded-lg border border-border-default p-4">
      <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-text-inverse">
        {stepNumber}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start gap-2">
            {optional && (
              <span className="rounded-full bg-brand-subtitle/40 px-2.5 py-0.5 text-xs font-medium text-brand-primary">
                Optional
              </span>
            )}
            <h3 className="text-base font-semibold text-text-heading">
              Step {stepNumber}: {title}
            </h3>
          </div>

          <p className="text-sm text-text-secondary">File type: Excel / CSV</p>
          {outputNote &&
            (outputReady ? (
              <button
                type="button"
                onClick={onOutputDownload}
                className="inline-flex max-w-full items-center gap-2 rounded-lg border border-brand bg-brand-subtitle/20 px-3 py-2 text-left text-sm font-bold text-brand-primary transition-colors hover:bg-brand-subtitle/40 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-border-selected"
              >
                <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
                <span className="min-w-0 truncate">
                  {outputNote}
                  <span className="mt-0.5 block text-xs font-normal text-text-secondary">
                    {outputDownloadFilename}
                  </span>
                </span>
              </button>
            ) : (
              <div className="rounded-lg border border-brand bg-brand-subtitle/20 px-3 py-2 text-sm font-bold text-brand-primary">
                {outputNote}
                {!outputReady && (
                  <span className="mt-0.5 block text-xs font-normal text-text-secondary">
                    Available after both Step 1 files upload successfully
                  </span>
                )}
              </div>
            ))}
          {footerNote && <p className="text-sm text-text-secondary">{footerNote}</p>}
        </div>

        <div className={fileSlotIds.length > 1 ? 'flex flex-col gap-2' : ''}>
          {fileSlotIds.map((slotId) => {
            const slotDisabled =
              disabled ||
              (slotId === 'heat-query-chem' && uploadStatus['heat-query'] !== 'success')
            return (
            <UploadFileInput
              key={slotId}
              disabled={slotDisabled}
              file={files[slotId] ?? null}
              uploadState={uploadStatus[slotId] ?? 'idle'}
              uploadError={uploadErrors[slotId]}
              onFileChange={(selected) => onFileSelect(slotId, selected)}
            />
            )
          })}
        </div>
      </div>
    </div>
  )
}
