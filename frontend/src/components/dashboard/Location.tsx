import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getLocations, getPlantsByLocation } from '../../service/location.service';

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
    view: 'locations' | 'plants';
    locationId?: string;
};

const locationsData: Location[] = [
    {
        id: '1',
        name: 'Jajpur',
        image: 'https://picsum.photos/id/101/200',
        description: 'This is the description of Jajpur',
    },
    {
        id: '2',
        name: 'Dhenkanal',
        image: 'https://picsum.photos/id/123/200',
        description: 'This is the description of Dhenkanal',
    },
    {
        id: '3',
        name: 'Cuttack',
        image: 'https://picsum.photos/id/103/200',
        description: 'This is the description of Cuttack',
    },
    {
        id: '4',
        name: 'Bhubaneswar',
        image: 'https://picsum.photos/id/104/200',
        description: 'This is the description of Bhubaneswar',
    },
    {
        id: '5',
        name: 'Baleswar',
        image: 'https://picsum.photos/id/106/200',
        description: 'This is the description of Baleswar',
    },
    {
        id: '6',
        name: 'Balasore',
        image: 'https://picsum.photos/id/107/200',
        description: 'This is the description of Balasore',
    },
    {
        id: '7',
        name: 'Ganjam',
        image: 'https://picsum.photos/id/108/200',
        description: 'This is the description of Ganjam',
    },
    {
        id: '8',
        name: 'Koraput',
        image: 'https://picsum.photos/id/179/200',
        description: 'This is the description of Koraput',
    },
    {
        id: '9',
        name: 'Sambalpur',
        image: 'https://picsum.photos/id/110/200',
        description: 'This is the description of Sambalpur',
    },
    {
        id: '10',
        name: 'Nayagarh',
        image: 'https://picsum.photos/id/111/200',
        description: 'This is the description of Nayagarh',
    },
];

function Location() {
    const [locations] = useState<Location[]>(locationsData);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [isLoadingPlants, setIsLoadingPlants] = useState(false);

    // breadcrumbs drive the current view
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { label: 'Locations', view: 'locations' },
    ]);

    const currentView = breadcrumbs[breadcrumbs.length - 1];

    // Fetch plants whenever we navigate into a location
    useEffect(() => {
        if (currentView.view !== 'plants' || !currentView.locationId) return;

        const fetchPlants = async () => {
            setIsLoadingPlants(true);
            try {
                const res = await getPlantsByLocation(currentView.locationId!);
                setPlants(res.body.data);
            } catch (error) {
                console.error(error);
                setPlants([]);
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
                view: 'plants',
                locationId: location.id,
            },
        ]);
    };

    // Navigate to a specific breadcrumb by index (clicking a crumb)
    const handleBreadcrumbClick = (index: number) => {
        // Clicking the last (active) crumb does nothing
        if (index === breadcrumbs.length - 1) return;
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
        if (breadcrumbs[index].view === 'locations') {
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
                        return (
                            <span key={index} className="flex items-center">
                                <button
                                    onClick={() => handleBreadcrumbClick(index)}
                                    disabled={isLast}
                                    className={`text-lg font-medium transition-colors ${
                                        isLast
                                            ? 'text-text-heading cursor-default'
                                            : 'text-primary hover:underline cursor-pointer'
                                    }`}
                                >
                                    {crumb.label}
                                </button>
                                {!isLast && (
                                    <span className="text-text-muted mx-1 select-none">&gt;</span>
                                )}
                            </span>
                        );
                    })}
                </div>

                {/* Locations view */}
                {currentView.view === 'locations' && (
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
                {currentView.view === 'plants' && (
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
                                onclick={() => {/* handle plant click if needed */}}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Location;