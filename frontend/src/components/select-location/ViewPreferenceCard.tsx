import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import type { ReactNode } from 'react'

type ViewPreferenceCardProps = {
  title: string
  description: string
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}

export function ViewPreferenceCard({
  title,
  description,
  icon,
  selected,
  onSelect,
}: ViewPreferenceCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      className={[
        'flex w-full flex-col items-center rounded-3xl bg-surface-card p-8 text-center shadow-sm transition-shadow',
        selected
          ? 'border-[3px] border-border-selected'
          : 'border border-transparent',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col items-center">
        <div className={`mb-4 flex items-center justify-center rounded-xl p-4 [&_svg]:size-6 ${selected ? 'text-border-selected bg-surface-selected' : 'text-text-heading bg-surface-icon-muted'}`}>
          {icon}
        </div>
        <h3 className="mb-1 text-xl font-bold text-text-heading">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>

      {selected && (
        <div className="mt-3 flex w-full items-center justify-start gap-1 text-xs font-medium text-border-selected">
          <FiberManualRecordIcon sx={{fontSize: '12px'}} />
          <span>selected view</span>
        </div>
      )}
    </article>
  )
}
