const API_URL = import.meta.env.VITE_API_URL;

const getLocations = async (page:number=1,limit:number=10,name:string='') => {
    try{
        const res = await fetch(`${API_URL}/locations?page=${page}&limit=${limit}&name=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!res.ok){
            throw new Error('Failed to fetch locations');
        }
        return await res.json();  
    }catch(error){
        console.error(error);
        throw error;
    }
}

export { getLocations };
