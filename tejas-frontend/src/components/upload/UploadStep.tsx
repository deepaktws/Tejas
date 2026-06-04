import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { type ChangeEvent, useId, useRef } from 'react'

type UploadFileInputProps = {
  disabled?: boolean
  file: File | null
  onFileChange: (file: File | null) => void
}

function UploadFileInput({ disabled = false, file, onFileChange }: UploadFileInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const isUploaded = file !== null

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    onFileChange(selected)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label
        htmlFor={disabled ? undefined : inputId}
        className={[
          'flex w-[200px] flex-row items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-2',
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
            disabled={disabled}
            onChange={handleInputChange}
          />
          <p className="mt-2 max-w-[120px] truncate text-xs text-text-primary">
            {file?.name ?? 'No file chosen'}
          </p>
        </div>
      </label>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={[
            'size-2 rounded-full',
            isUploaded ? 'bg-border-selected' : 'bg-text-muted',
          ].join(' ')}
          aria-hidden
        />
        <span
          className={
            isUploaded ? 'font-medium text-border-selected' : 'text-text-secondary'
          }
        >
          {isUploaded ? 'Uploaded' : 'Not uploaded'}
        </span>
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
  onFileSelect: (slotId: string, file: File | null) => void
  disabled?: boolean
}

export function UploadStep({
  stepNumber,
  title,
  optional = false,
  outputNote,
  footerNote,
  fileSlotIds,
  files,
  onFileSelect,
  disabled = false,
}: UploadStepProps) {
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
          {outputNote && (
            <div className="rounded-lg border border-brand bg-brand-subtitle/20 px-3 py-2 text-sm font-bold text-brand-primary">
              {outputNote}
            </div>
          )}
          {footerNote && <p className="text-sm text-text-secondary">{footerNote}</p>}
        </div>

        <div className={fileSlotIds.length > 1 ? 'flex flex-col gap-2' : ''}>
          {fileSlotIds.map((slotId) => (
            <UploadFileInput
              key={slotId}
              disabled={disabled}
              file={files[slotId] ?? null}
              onFileChange={(selected) => onFileSelect(slotId, selected)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
