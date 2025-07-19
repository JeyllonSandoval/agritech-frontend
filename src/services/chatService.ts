import { Message } from '@/types/message';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_AGRITECH_API_URL;

const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return token;
};

const getUserLanguage = () => {
    return localStorage.getItem('language') || 'en';
};

export const chatService = {
    async sendMessage(chatId: string, content: string, fileId?: string): Promise<Message> {
        const token = getToken();
        const userLanguage = getUserLanguage();
        const body: any = {
            ChatID: chatId,
            contentAsk: content,
            sendertype: 'user',
            status: 'active'
        };
        
        // Si hay un fileId, incluirlo en el body para que el backend procese el contenido
        if (fileId) {
            body.FileID = fileId;
            // También incluir un indicador de que este mensaje está relacionado con un archivo
            body.contentFile = 'file_attached';
            console.log(`ChatService - Enviando mensaje con archivo: FileID=${fileId}`);
        } else {
            console.log(`ChatService - Enviando mensaje sin archivo`);
        }

        console.log(`ChatService - Body enviado:`, body);

        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'user-language': userLanguage
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Failed to send message');
        const backendResponse = await response.json();
        console.log(`ChatService - Respuesta del backend:`, backendResponse);
        
        const msg = backendResponse.message;
        return {
            MessageID: msg.id,
            ChatID: msg.chatId,
            FileID: msg.fileId,
            sendertype: msg.senderType,
            contentAsk: msg.senderType === 'user' ? msg.content : undefined,
            contentResponse: msg.senderType === 'ai' ? msg.content : undefined,
            createdAt: msg.createdAt,
            status: msg.status
        };
    },

    async getMessages(chatId: string): Promise<Message[]> {
        const token = getToken();
        const response = await fetch(`${API_URL}/messages/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load messages');
        const messages = await response.json();
        if (!Array.isArray(messages)) {
            throw new Error('Invalid response format: messages is not an array');
        }
        return messages;
    },

    async sendFileMessage(chatId: string, fileId: string): Promise<Message> {
        const token = getToken();
        const userLanguage = getUserLanguage();
        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'user-language': userLanguage
            },
            body: JSON.stringify({
                ChatID: chatId,
                FileID: fileId,
                contentFile: 'New file selected',
                sendertype: 'user',
                status: 'active'
            })
        });

        if (!response.ok) throw new Error('Failed to send file message');
        const backendResponse = await response.json();
        const msg = backendResponse.message;
        return {
            MessageID: msg.id,
            ChatID: msg.chatId,
            FileID: msg.fileId,
            sendertype: msg.senderType,
            contentFile: msg.content || msg.contentFile,
            createdAt: msg.createdAt,
            status: msg.status
        };
    },

    async deleteAllChats(): Promise<void> {
        const token = getToken();
        const decodedToken = jwtDecode(token) as { UserID: string };
        
        const response = await fetch(`${API_URL}/chat/user/${decodedToken.UserID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete chats');
        }
    }
}; 