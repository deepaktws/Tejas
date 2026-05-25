import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getLocations } from '../../service/location.service';

interface Location {
    id: string;
    name: string;
    description: string;
}

function Location() {
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Locations"]);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try{
            const res = await getLocations();
            const data = res.body.data;
            setLocations(data);
            }catch(error){
                console.error(error);
            }
        }
        fetchLocations();
    }, []);
    const handleLocationClick = (location: Location) => {
        
    }
    return (
        <div className="flex flex-col h-full p-4">
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
                    {locations.length === 0 && <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-lg font-medium text-text-heading">No locations found</h2>
                    </div>}
                    {locations.length > 0 && locations.map((location,index) => (
                        <OrganizationCard key={index} name={location.name} onclick={() => handleLocationClick(location.id)} />
                    ))}
                </div>
            </div>
        </div>
    );   
    
}
export default Location
