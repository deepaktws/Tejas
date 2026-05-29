
import CustomTable from './Input/CustomTable'

// ─── Main Input Component ─────────────────────────────────────────────────────
function Input() {

  return (
    <div className="flex flex-col gap-4 bg-surface-card px-6 py-5">
      {/* <CustomTableWithData title="ORDER PLAN" data={orderPlanData} />
      <CustomTableWithData title="SCRAP AVAILABILITY" data={scrapAvailabilityData} /> */}
      <CustomTable title="Heat Schedule" />
      <CustomTable title="Scrap Availability" />
    </div>
  )
}

export default Input