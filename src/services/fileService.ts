import { jwtDecode } from 'jwt-decode';
import { FileProps } from '@/hooks/getFiles';

const API_URL = process.env.NEXT_PUBLIC_AGRITECH_API_URL;

const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return token;
};

export const fileService = {
    async deleteAllFiles(): Promise<void> {
        const token = getToken();
        const decodedToken = jwtDecode(token) as { UserID: string };
        
        const response = await fetch(`${API_URL}/files/user/${decodedToken.UserID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete files');
        }
    }
}; 