import { AnalysisRequest, ChatMessage } from '@/modules/common/types/chat';

export const analyzeDocument = async (request: AnalysisRequest): Promise<ChatMessage> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        console.log('Estado actual de la solicitud:', {
            ChatID: request.ChatID,
            FileID: request.FileID,
            content: request.content,
            timestamp: new Date().toISOString()
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Server error details:', errorData);
            throw new Error(errorData?.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        return data.newMessage;
    } catch (error) {
        console.error('Error in analyzeDocument:', error);
        throw error;
    }
}; 