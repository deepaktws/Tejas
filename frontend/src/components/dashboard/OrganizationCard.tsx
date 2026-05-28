function OrganizationCard({ name,image,onclick }: { name: string, image: string, onclick?: () => void }) {
    return (
      <button
        type="button"
        className="flex aspect-3/2 w-62 h-50 flex-col justify-end rounded-lg bg-surface-card border border-border-default overflow-hidden shadow-(--shadow-card) transition-shadow hover:shadow-[0px_12px_9px_rgba(0,0,0,0.12),0px_5px_4px_rgba(0,0,0,0.1)]"
        onClick={onclick}
      >
        <img src={image} alt={name} className="w-full h-full object-cover rounded-t-lg hover:scale-105 transition-all duration-300 ease-in-out " />
        <span className="text-center text-base font-bold tracking-wide text-text-secondary py-4">
            {name}
        </span>
      </button>
    )
  }
export default OrganizationCard;