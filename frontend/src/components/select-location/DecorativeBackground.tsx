export function DecorativeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -right-20 -top-16 size-64 rounded-full border-[40px] border-surface-decor opacity-10 sm:size-80" />
      <div className="absolute left-1/3 top-1/2 size-64 rounded-full border-[40px] border-surface-decor opacity-10 sm:size-80" />
      <div className="absolute -left-24 top-0 size-64 rounded-full border-[40px] border-surface-decor opacity-10 sm:size-80" />
      <div className="absolute -left-16 bottom-0 size-48 rounded-full border-[30px] border-surface-decor opacity-10 sm:size-60" />
      <div className="absolute right-8 bottom-8 size-48 rounded-full border-[30px] border-surface-decor opacity-10 sm:size-60" />
      <div className="absolute right-1/4 top-1/3 size-28 rounded-full bg-surface-decor opacity-[0.07] sm:size-36" />
      <div className="absolute left-1/2 top-24 size-28 rounded-full bg-surface-decor opacity-[0.07] sm:size-36" />
      <div className="absolute left-1/4 -top-8 size-28 rounded-full bg-surface-decor opacity-[0.07] sm:size-36" />
    </div>
  )
}
