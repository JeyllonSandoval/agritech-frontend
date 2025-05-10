import { Message } from '@/types/message';

export const sendMessage = async (chatId: string, content: string): Promise<Message> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ChatID: chatId,
                contentAsk: content,
                sendertype: 'user',
                status: 'active',
                createdAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Server error details:', errorData);
            throw new Error(errorData?.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data.newMessage;
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/messages/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load chat history');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getChatMessages:', error);
        throw error;
    }
}; 