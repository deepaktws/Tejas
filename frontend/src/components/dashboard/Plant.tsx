import { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import { getPlants } from '../../service/plant.service';

interface Plant {
    id: string;
    name: string;
    description: string;
    image: string;
}

const plantsData: Plant[] = [
    {
        id: '1',
        name: 'Steel Plant',
        image: 'https://picsum.photos/id/201/200',
        description: 'This is the description of Jajpur',
    },
    {
        id: '2',
        name: 'Cement Plant',
        image: 'https://picsum.photos/id/223/200',
        description: 'This is the description of Dhenkanal',
    },
    {
        id: '3',
        name: 'Power Plant',
        image: 'https://picsum.photos/id/203/200',
        description: 'This is the description of Cuttack',
    },
    {
        id: '4',
        name: 'Water Plant',
        image: 'https://picsum.photos/id/204/200',
        description: 'This is the description of Bhubaneswar',
    },
    {
        id: '5',
        name: 'Gas Plant',
        image: 'https://picsum.photos/id/206/200',
        description: 'This is the description of Baleswar',
    },
    {
        id: '6',
        name: 'Oil Plant',
        image: 'https://picsum.photos/id/307/200',
        description: 'This is the description of Balasore',
    },
    {
        id: '7',
        name: 'Chemical Plant',
        image: 'https://picsum.photos/id/208/200',
        description: 'This is the description of Ganjam',
    },
    {
        id: '8',
        name: 'Paper Plant',
        image: 'https://picsum.photos/id/279/200',
        description: 'This is the description of Koraput',
    },
    {
        id: '9',
        name: 'Rubber Plant',
        image: 'https://picsum.photos/id/210/200',
        description: 'This is the description of Sambalpur',
    },
    {
        id: '10',
        name: 'Sugar Plant',
        image: 'https://picsum.photos/id/211/200',
        description: 'This is the description of Nayagarh',
    }

]

function Plant() {
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Plants"]);
    const [plants, setPlants] = useState<Plant[]>(plantsData);
        
    // useEffect(() => {
    //     const fetchPlants = async () => {
    //         try{
    //         const res = await getPlants();
    //         console.log(res);
    //         const data = res.body.data;
    //         setPlants(data);
    //         }catch(error){
    //             console.error(error);
    //         }
    //     }
    //     fetchPlants();
    // }, []);
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
                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 w-full items-center justify-center">
                    {plants.length === 0 && <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-lg font-medium text-text-heading">No plants found</h2>
                    </div>}
                    {plants.length > 0 && plants.map((plant,index) => (
                        <OrganizationCard key={index} name={plant.name} image={plant.image} onclick={() => handlePlantClick(plant)} />
                    ))}
                </div>
            </div>
        </div>
    );   
    
}
export default Plant
