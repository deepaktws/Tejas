import type { ReactNode } from 'react'

type FeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-surface-glass-border bg-surface-glass p-6">
      <div className="flex size-11 items-center justify-center rounded-[10px] bg-surface-icon text-text-inverse [&_svg]:size-6">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-inverse">{title}</h3>
        <p className="text-sm leading-relaxed text-text-inverse-muted">
          {description}
        </p>
      </div>
    </article>
  )
}
