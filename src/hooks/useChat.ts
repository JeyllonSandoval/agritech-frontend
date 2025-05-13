import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import { jwtDecode } from 'jwt-decode';
import predefinedQuestions from '@/data/predefinedQuestions.json';

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
            
            // Set up polling interval for real-time updates
            const intervalId = setInterval(() => {
                loadChatHistory(currentChat.ChatID);
            }, 5000); // Poll every 5 seconds

            // Cleanup interval on unmount or when chat changes
            return () => clearInterval(intervalId);
        }
    }, [currentChat]);

    const loadChatHistory = async (chatId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/messages/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load chat history');
            
            const allMessages = await response.json();
            if (!Array.isArray(allMessages)) {
                throw new Error('Invalid response format: messages is not an array');
            }
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

    const handleFileSelect = async (file: FileProps) => {
        if (!currentChat) return;
        setSelectedFile(file);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            // Send file selection message to backend
            const fileMessageResponse = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ChatID: currentChat.ChatID,
                    FileID: file.FileID,
                    contentFile: 'New file selected',
                    sendertype: 'user',
                    status: 'active'
                })
            });

            let fileMessage = await fileMessageResponse.json();
            // Fallback for createdAt
            if (!fileMessage.createdAt) fileMessage.createdAt = new Date().toISOString();
            setMessages(prev => [...prev, fileMessage]);

            // Add predefined questions as AI responses
            const questions = predefinedQuestions.questions;
            const questionPromises = questions.map(async (q) => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ChatID: currentChat.ChatID,
                        FileID: file.FileID,
                        sendertype: 'ai',
                        contentAsk: q.question,
                        contentResponse: q.description,
                        status: 'active',
                        isPredefinedQuestion: true
                    })
                });
                let msg = await response.json();
                // Fallback for createdAt
                if (!msg.createdAt) msg.createdAt = new Date().toISOString();
                return msg;
            });

            const questionMessages = await Promise.all(questionPromises);
            setMessages(prev => [...prev, ...questionMessages]);
        } catch (err) {
            console.error('Error sending messages:', err);
            setError(err instanceof Error ? err.message : 'Error sending messages');
        }
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
        loadChat,
        loadChatHistory
    };
}; 