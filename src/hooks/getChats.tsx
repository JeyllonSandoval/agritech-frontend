import { jwtDecode } from 'jwt-decode';

interface UserData {
    UserID: string;
}

interface TokenData {
    UserID: string;
    // otros campos del token si los hay
}

export interface GetChatsProps {
    ChatID: string;
    UserID: string;
    chatname: string;
    createdAt: string;
}

export async function getChats(): Promise<GetChatsProps[]> {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication found');
        }

        const decodedToken = jwtDecode(token) as TokenData;
        const userData: UserData = { UserID: decodedToken.UserID };

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat/user/${userData.UserID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.chats;

    } catch (error) {
        console.error('Error fetching chats:', error);
        return [];
    }
}
