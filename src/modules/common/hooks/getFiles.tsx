import { jwtDecode } from 'jwt-decode';

interface TokenData {
    UserID: string;
}

export interface FileProps {
    FileID: string;
    UserID: string;
    FileName: string;
    createdAt: string;
}

export const getFiles = async (): Promise<FileProps[]> => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication found');
        }

        const decodedToken = jwtDecode(token) as TokenData;
        const UserID = decodedToken.UserID;

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/files/user/${UserID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return []
        }

        const data = await response.json();
        return data.files;
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
};


