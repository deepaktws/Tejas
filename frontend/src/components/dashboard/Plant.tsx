import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { locationsData, plantsData } from '../../staticData';
import { getPlants } from '../../service/plant.service';

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
    plantId?: string;
};



function Plant() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);

    // breadcrumbs drive the current view
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { label: 'Plant', view: 'plant' },
    ]);

    const currentView = breadcrumbs[breadcrumbs.length - 1];

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                // const res = await getPlants();  //call here the service to fetch all the plants 
                // const data = res.body.data;
                setPlants(plantsData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPlants();
    }, []);

    // Fetch locations whenever we navigate into a plant
    useEffect(() => {
        if (currentView.view !== 'location' || !currentView.plantId) return;

        const fetchLocations = async () => {
            setIsLoadingLocations(true);
            try {
                // const locations = await getLocationsByPlant(currentView.label); // call here the service to fetch locations by plant
                setLocations(locationsData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingLocations(false);
            }
        };

        fetchLocations();
    }, [currentView]);

    const handlePlantClick = (plant: Plant) => {
        setBreadcrumbs((prev) => [
            ...prev,
            {
                label: plant.name,
                view: 'location',
                plantId: plant.id,
            },
        ]);
    };

    // Navigate to a specific breadcrumb by index (clicking a crumb)
    const handleBreadcrumbClick = (index: number) => {
        // Clicking the last (active) crumb does nothing
        if (index === breadcrumbs.length - 1) return;
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
        if (breadcrumbs[index].view === 'plant') {
            setLocations([]);
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

                {/* Plants view */}
                {currentView.view === 'plant' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {plants.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                            </div>
                        )}
                        {plants.map((plant, index) => (
                            <OrganizationCard
                                key={index}
                                name={plant.name}
                                image={plant.image}
                                onclick={() => handlePlantClick(plant)}
                            />
                        ))}
                    </div>
                )}

                {/* Locations view */}
                {currentView.view === 'location' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full">
                        {isLoadingLocations && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">Loading locations...</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full col-span-full">
                                <h2 className="text-lg font-medium text-text-heading">No locations found</h2>
                            </div>
                        )}
                        {!isLoadingLocations && locations.map((location, index) => (
                            <OrganizationCard
                                key={index}
                                name={location.name}
                                image={location.image}
                                onclick={() => {/* handle location click if needed */ }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Plant;