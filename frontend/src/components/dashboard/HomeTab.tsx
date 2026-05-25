import { useState } from "react";
import OrganizationCard from "./OrganizationCard";

const LOCATIONS = [
    {
        id: '1',
        name: 'Vijayanagar',
        plants:['Plant 1', 'Plant 2', 'Plant 3', 'Plant 4'],
    },
    {
        id: '2',
        name: 'Dolvi',
        plants:['Plant 1', 'Plant 2', 'Plant 3', 'Plant 4'],
    },
];
function HomeTab() {
    const [selectedLocation, setSelectedLocation] = useState<{ id: string, name: string, plants: string[] } | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Locations"]);
    const handleLocationClick = (locationId: string) => {
        const location = LOCATIONS.find((location) => location.id === locationId);
        if (location) {
            setSelectedLocation(location);
            setBreadcrumbs([...breadcrumbs, location.name]);
        } else {
            setSelectedLocation(null);
            setBreadcrumbs(["Locations"]);
        }
    }
    return (
        <div className="flex flex-col h-full ">
            <div className="flex-1 overflow-auto">
                <div className="flex flex-row h-full bg-surface-card">
                {breadcrumbs.length > 0 && breadcrumbs.map((breadcrumb) => (
                    <h2 className="text-lg font-medium text-text-heading" key={breadcrumb}>
                        {breadcrumb}
                        <span className="text-text-muted">
                            {breadcrumb === breadcrumbs[breadcrumbs.length - 1] ? '' : ' > '}
                        </span>
                    </h2>
                ))}
                </div>
                <div className="flex flex-wrap gap-6 py-4">
                    {selectedLocation ? 
                    selectedLocation.plants.map((plant) => (
                            <OrganizationCard key={plant} name={plant} />
                        ))
                    :
                    LOCATIONS.map((location) => (
                        <OrganizationCard key={location.id} name={location.name} onclick={() => handleLocationClick(location.id)} />
                    ))
                }
                </div>
            </div>
        </div>
    );
}
export default HomeTab;