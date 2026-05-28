export const locationsData = [
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
    }
];

export const plantsData = [
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

export type UserRole = 'User' | 'Admin'

export type AdminUser = {
    id: string
    userName: string
    email: string
    designation: string
    contact: string
    role: UserRole
}

export type Area = {
    id: string
    areaName: string
    locationName: string
    creationDateTime: string
    lastUpdate: string
}
export type Location = {
    id: string
    name: string
    businessUnit: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

export const usersData: AdminUser[] = [
    {
        id: '1',
        userName: 'Ankita Kadam',
        email: 'ankita.kadam@jsw.in',
        designation: 'JSW Digital',
        contact: '2892872920',
        role: 'User',
    },
    {
        id: '2',
        userName: 'Janhvi Singh',
        email: 'janhvi.singh@jsw.in',
        designation: 'Manager - Operations, SP1',
        contact: '9757025807',
        role: 'Admin',
    },
    {
        id: '3',
        userName: 'Omer Miranda',
        email: 'omer.miranda@jsw.in',
        designation: 'Senior Manager - Sinter plant-1',
        contact: '9087654334',
        role: 'User',
    },
    {
        id: '4',
        userName: 'Aarav Sharma',
        email: 'aarav.sharma@jsw.in',
        designation: 'GET',
        contact: '0987623488',
        role: 'User',
    },
    {
        id: '5',
        userName: 'Priya Mehta',
        email: 'priya.mehta@jsw.in',
        designation: 'Digital Manager',
        contact: '9876523789',
        role: 'User',
    },
    {
        id: '6',
        userName: 'Sneha Iyer',
        email: 'sneha.iyer@jsw.in',
        designation: 'Solution Associate',
        contact: '0987654234',
        role: 'User',
    },
    {
        id: '7',
        userName: 'Ananya Desai',
        email: 'ananya.desai@jsw.in',
        designation: 'Ananya Desai',
        contact: '2345678998',
        role: 'User',
    },
    {
        id: '8',
        userName: 'Neha Kulkarni',
        email: 'neha.kulkarni@jsw.in',
        designation: 'JSW Digital',
        contact: '8765434567',
        role: 'User',
    },
    {
        id: '9',
        userName: 'Vivek Singh',
        email: 'vivek.singh@jsw.in',
        designation: 'GET',
        contact: '0987645678',
        role: 'User',
    },
    {
        id: '10',
        userName: 'Rohan Patil',
        email: 'rohan.patil@jsw.in',
        designation: 'GET',
        contact: '8765437890',
        role: 'User',
    },
    {
        id: '11',
        userName: 'Kavya Nair',
        email: 'kavya.nair@jsw.in',
        designation: 'Senior Manager',
        contact: '9876534568',
        role: 'User',
    },
]

export const areasData: Area[] = [
    {
        id: '1',
        areaName: 'Vijayanagar - Sinter Plant',
        locationName: 'Vijayanagar',
        creationDateTime: '2021-01-01 12:00:00',
        lastUpdate: '2021-01-01 12:00:00',
    },
    {
        id: '2',
        areaName: 'Vijayanagar - Pellet Plant',
        locationName: 'Vijayanagar',
        creationDateTime: '2021-01-01 12:00:00',
        lastUpdate: '2021-01-01 12:00:00',
    },  
    {
        id: '3',
        areaName: 'BPSL - Pellet Plant',
        locationName: 'Sambalpur',
        creationDateTime: '2021-01-01 12:00:00',
        lastUpdate: '2021-01-01 12:00:00',
    },
    {
        id: '4',
        areaName: 'Dolvi - Blast Furnace',
        locationName: 'Dolvi',
        creationDateTime: '2022-03-14 09:30:00',
        lastUpdate: '2022-05-21 11:45:00',
    },
    {
        id: '5',
        areaName: 'Salem - Steel Melt Shop',
        locationName: 'Salem',
        creationDateTime: '2022-06-11 14:10:00',
        lastUpdate: '2022-08-02 16:20:00',
    },
    {
        id: '6',
        areaName: 'Tarapur - Power Plant',
        locationName: 'Tarapur',
        creationDateTime: '2022-07-19 08:00:00',
        lastUpdate: '2022-10-15 13:25:00',
    },
    {
        id: '7',
        areaName: 'Vijayanagar - Coke Oven Plant',
        locationName: 'Vijayanagar',
        creationDateTime: '2023-01-05 10:15:00',
        lastUpdate: '2023-03-10 17:00:00',
    },
    {
        id: '8',
        areaName: 'Sambalpur - Rolling Mill',
        locationName: 'Sambalpur',
        creationDateTime: '2023-02-18 07:40:00',
        lastUpdate: '2023-04-22 09:10:00',
    },
    {
        id: '9',
        areaName: 'Dolvi - Lime Calcination Plant',
        locationName: 'Dolvi',
        creationDateTime: '2023-05-12 15:50:00',
        lastUpdate: '2023-07-01 18:35:00',
    }
];

export const AdminLocationsData: Location[] = [
    {
        id: '1',
        name: 'Vijayanagar',
        businessUnit: 'JSW Steel Plant',
        address: '123, Main Street, Vijayanagar',
        city: 'Vijayanagar',
        state: 'Odisha',
        zipCode: '751001',
        country: 'India',
    },
    {
        id: '2',
        name: 'Dolvi',
        businessUnit: 'JSW Steel Plant',
        address: '123, Main Street, Dolvi',
        city: 'Dolvi',
        state: 'Maharashtra',
        zipCode: '415412',
        country: 'India',
    },
    {
        id: '3',
        name: 'BPSL',
        businessUnit: 'JSW Steel Plant',
        address: '123, Main Street, BPSL',
        city: 'BPSL',
        state: 'Odisha',
        zipCode: '751001',
        country: 'India',
    },
    {
        id: '4',
        name: 'Raigarh',
        businessUnit: 'JSW Steel Plant',
        address: '123, Main Street, Raigarh',
        city: 'Raigarh',
        state: 'Chhattisgarh',
        zipCode: '496001',
        country: 'India',
    },
    {
        id: '5',
        name: 'Salem',
        businessUnit: 'Steel Plant',
        address: '123, Main Street, Salem',
        city: 'Salem',
        state: 'Tamil Nadu',
        zipCode: '636001',
        country: 'India',
    },
    {
        id: '6',
        name: 'Tarapur',
        businessUnit: 'Steel Plant',
        address: '123, Main Street, Tarapur',
        city: 'Tarapur',
        state: 'Maharashtra',
        zipCode: '415412',
        country: 'India',
    },
    {
        id: '7',
        name: 'Vijayanagar',
        businessUnit: 'Steel Plant',
        address: '123, Main Street, Vijayanagar',
        city: 'Vijayanagar',
        state: 'Odisha',
        zipCode: '751001',
        country: 'India',
    },
    {
        id: '8',
        name: 'Dolvi',
        businessUnit: 'Steel Plant',
        address: '123, Main Street, Dolvi',
        city: 'Dolvi',
        state: 'Maharashtra',
        zipCode: '415412',
        country: 'India',
    },
]