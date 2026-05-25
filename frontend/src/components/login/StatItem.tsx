type StatItemProps = {
  value: string
  label: string
}

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-4xl font-semibold leading-10 text-text-inverse">
        {value}
      </span>
      <span className="text-sm text-text-inverse-muted">{label}</span>
    </div>
  )
}
