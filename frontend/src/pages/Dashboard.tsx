import { useSearchParams, Navigate } from "react-router-dom";
import { ViewPreference } from "../enums/view-preference";
import Location from "../components/dashboard/Location";
import Plant from "../components/dashboard/Plant";

function Dashboard() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    if (type === ViewPreference.Location) {
        return <Location />
    }
    if (type === ViewPreference.Plant) {
        return <Plant />
    }
    return <Navigate to="/select-location" />
}
export default Dashboard;