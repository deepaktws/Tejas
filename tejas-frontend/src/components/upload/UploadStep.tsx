import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { type ChangeEvent, useId, useRef } from 'react'

export type UploadStepProps = {
  stepNumber: number
  title: string
  optional?: boolean
  outputNote?: string
  footerNote?: string
  file: File | null
  onFileSelect: (file: File | null) => void
  disabled?: boolean
}

export function UploadStep({
  stepNumber,
  title,
  optional = false,
  outputNote,
  footerNote,
  file,
  onFileSelect,
  disabled = false,
}: UploadStepProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const isUploaded = file !== null

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    onFileSelect(selected)
  }

  return (
    <div className="relative flex gap-4 border border-border-default rounded-lg p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-text-inverse z-10">
          {stepNumber}
        </div>

      <div className="min-w-0 flex-1 flex flex-col md:flex-row gap-2 justify-between items-start">
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
          <div className=" rounded-lg border border-brand bg-brand-subtitle/20 px-3 font-bold py-2 text-sm text-brand-primary">
            {outputNote}
          </div>
        )}
        {footerNote && (
          <p className="mt-1 text-sm text-text-secondary">{footerNote}</p>
        )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label
          htmlFor={disabled ? undefined : inputId}
            className={[
              'flex min-w-[200px] flex-row gap-2 items-center justify-center rounded-lg border border-dashed px-6 py-2',
              disabled
                ? 'cursor-not-allowed border-border-default opacity-60'
                : 'border-border-default bg-surface-card hover:border-brand-accent cursor-pointer',
            ].join(' ')}
          >
            <FileUploadOutlinedIcon
              className="text-text-muted"
              sx={{ fontSize: 28 }}
              aria-hidden
            />
            <div className="flex flex-col items-start justify-center">
            <span
              className="rounded-md text-sm font-medium text-text-secondary"
            >
              Choose File
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              disabled={disabled}
              onChange={handleFileChange}
            />
            <p className="mt-2 max-w-[180px] truncate text-xs text-text-primary">
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
            <span className={isUploaded ? 'font-medium text-border-selected' : 'text-text-secondary'}>
              {isUploaded ? 'Uploaded' : 'Not uploaded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
