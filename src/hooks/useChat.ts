import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    UserID: string;
}

interface UseChatProps {
    ChatID?: string | null;
}

export const useChat = ({ ChatID }: UseChatProps) => {
    const currentChat = useChatStore(state => state.currentChat);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadChat = async (chatID: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
            const decoded = jwtDecode<TokenPayload>(token);
            const userID = decoded.UserID;

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat/${userID}/${chatID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const chat = await response.json();
            setCurrentChat(chat);
        } catch (err) {
            console.error('Error loading chat:', err);
            setError(err instanceof Error ? err.message : 'Error loading chat');
        }
    };

    useEffect(() => {
        if (ChatID) {
            loadChat(ChatID);
        }
    }, [ChatID]);

    useEffect(() => {
        resetChatState();
    }, [currentChat]);

    useEffect(() => {
        if (currentChat?.ChatID) {
            loadChatHistory(currentChat.ChatID);
        }
    }, [currentChat]);

    const loadChatHistory = async (chatId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/messages/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const allMessages = await response.json();
            const processedMessages = processMessages(allMessages);
            setMessages(processedMessages);
        } catch (err) {
            console.error('Error loading chat history:', err);
            setError(err instanceof Error ? err.message : 'Error loading chat history');
        }
    };

    const processMessages = (messages: Message[]): Message[] => {
        return messages.reduce((acc: Message[], message: Message) => {
            if (message.FileID && message.sendertype === 'user') {
                const lastFileMessage = acc.findLast(m => m.FileID && m.sendertype === 'user');
                if (!lastFileMessage || lastFileMessage.FileID !== message.FileID) {
                    acc.push({
                        ...message,
                        contentFile: 'New file selected'
                    });
                }
            } else {
                acc.push(message);
            }
            return acc;
        }, []);
    };

    const resetChatState = () => {
        setSelectedFile(null);
        setMessages([]);
        setError(null);
        setIsAnalyzing(false);
    };

    const handleFileSelect = (file: FileProps) => {
        if (!currentChat) return;
        setSelectedFile(file);
        
        const newMessage: Message = {
            MessageID: Date.now().toString(),
            ChatID: currentChat.ChatID,
            FileID: file.FileID,
            contentFile: 'New file selected',
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, newMessage]);
    };

    return {
        currentChat,
        messages,
        selectedFile,
        isAnalyzing,
        error,
        setError,
        setIsAnalyzing,
        setMessages,
        handleFileSelect,
        loadChat
    };
}; 