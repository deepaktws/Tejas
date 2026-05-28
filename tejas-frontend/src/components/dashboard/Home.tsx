import CustomTable from "./CustomTable";
import ProductionStats from "./ProductionStats";
import { orderPlanData, scrapAvailabilityData } from "../../staticData";
function Home() {
    return (
        <div className="px-6 py-4">
            <ProductionStats />
            <CustomTable title="Order Plan" data={orderPlanData} />
            <CustomTable title="SCRAP AVAILABILITY" data={scrapAvailabilityData} />
        </div>
    )
}
export default Home;