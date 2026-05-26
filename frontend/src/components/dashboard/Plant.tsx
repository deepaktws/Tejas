import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getPlants } from '../../service/plant.service';

interface Plant {
    id: string;
    name: string;
    description: string;
}

function Plant() {
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Plants"]);
    const [plants, setPlants] = useState<Plant[]>([]);
        
    useEffect(() => {
        const fetchPlants = async () => {
            try{
            const res = await getPlants();
            console.log(res);
            const data = res.body.data;
            setPlants(data);
            }catch(error){
                console.error(error);
            }
        }
        fetchPlants();
    }, []);
    const handlePlantClick = (plant: Plant) => {
        
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
                    {plants.length === 0 && <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                    </div>}
                    {plants.length > 0 && plants.map((plant,index) => (
                        <OrganizationCard key={index} name={plant.name} onclick={() => handlePlantClick(plant)} />
                    ))}
                </div>
            </div>
        </div>
    );   
    
}
export default Plant
