const API_URL = import.meta.env.VITE_API_URL;
const loginService = async (email: string, password: string) => {
    try{
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName:email, password }),
        });
        if(!res.ok){
            throw new Error('Failed to login');
        }
        return res.json();
    }catch(error){
        console.error(error);
        throw error;
    }
}

export default loginService