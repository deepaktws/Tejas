function OrganizationCard({ name,onclick }: { name: string, onclick?: () => void }) {
    return (
      <button
        type="button"
        className="flex aspect-3/2 w-56 flex-col justify-end rounded-lg bg-surface-card border border-border-default px-4 pb-5 shadow-(--shadow-card) transition-shadow hover:shadow-[0px_12px_9px_rgba(0,0,0,0.12),0px_5px_4px_rgba(0,0,0,0.1)]"
        onClick={onclick}
      >
        <span className="text-center text-base font-bold tracking-wide text-text-secondary">
          {name}
        </span>
      </button>
    )
  }
export default OrganizationCard;