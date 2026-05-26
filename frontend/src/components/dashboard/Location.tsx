import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { locationsData, plantsData } from '../../staticData';
import { getLocations } from '../../service/location.service';

interface Location {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface Plant {
    id: string;
    name: string;
    description: string;
    image: string;
}

type BreadcrumbItem = {
    label: string;
    view: 'location' | 'plant';
    locationId?: string;
};



function Location() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [isLoadingPlants, setIsLoadingPlants] = useState(false);

    // breadcrumbs drive the current view
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { label: 'Location', view: 'location' },
    ]);

    const currentView = breadcrumbs[breadcrumbs.length - 1];


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // const res = await getLocations(); // call here the service to fetch all the locations
                // const data = res.body.data;
                setLocations(locationsData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLocations();
    }, []);

    // Fetch plants whenever we navigate into a location
    useEffect(() => {
        if (currentView.view !== 'plant' || !currentView.locationId) return;

        const fetchPlants = async () => {
            setIsLoadingPlants(true);
            try {
                // const plants = await getPlantsByLocation(currentView.label); // call here the service to fetch plants by location name
                setPlants(plantsData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingPlants(false);
            }
        };

        fetchPlants();
    }, [currentView]);

    const handleLocationClick = (location: Location) => {
        setBreadcrumbs((prev) => [
            ...prev,
            {
                label: location.name,
                view: 'plant',
                locationId: location.id,
            },
        ]);
    };

    // Navigate to a specific breadcrumb by index (clicking a crumb)
    const handleBreadcrumbClick = (index: number) => {
        // Clicking the last (active) crumb does nothing
        if (index === breadcrumbs.length - 1) return;
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
        if (breadcrumbs[index].view === 'location') {
            setPlants([]);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-1 overflow-auto">

                {/* Breadcrumb bar */}
                <div className="flex flex-row flex-wrap items-center gap-1 h-auto bg-surface-card mb-2">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;
                        return (
                            <span key={index} className="flex items-center">
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    disabled={isLast}
                                    className={`text-lg font-medium transition-colors${isLast
                                        ? 'cursor-default'
                                        : 'hover:underline cursor-pointer'
                                        }
                                        ${isFirst
                                            ? 'text-text-primary'
                                            : 'text-brand-danger font-bold'
                                        }
                                `}
                                >
                                    {crumb.label}
                                </button>
                                {!isLast && (
                                    <span className="text-brand-danger mx-1 select-none">&gt;</span>
                                )}
                            </span>
                        );
                    })}
                </div>

                {/* Locations view */}
                {currentView.view === 'location' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {locations.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No locations found</h2>
                            </div>
                        )}
                        {locations.map((location, index) => (
                            <OrganizationCard
                                key={index}
                                name={location.name}
                                image={location.image}
                                onclick={() => handleLocationClick(location)}
                            />
                        ))}
                    </div>
                )}

                {/* Plants view */}
                {currentView.view === 'plant' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingPlants && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading plants...</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                            </div>
                        )}
                        {!isLoadingPlants && plants.map((plant, index) => (
                            <OrganizationCard
                                key={index}
                                name={plant.name}
                                image={plant.image}
                                onclick={() => {/* handle plant click if needed */ }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Location;