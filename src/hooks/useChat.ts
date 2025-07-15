import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import { jwtDecode } from 'jwt-decode';
import predefinedQuestions from '@/data/Lenguage/en/predefinedQuestions.json';
import { chatService } from '@/services/chatService';

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
    const [isLoading, setIsLoading] = useState(false);

    // Cargar historial inicial
    useEffect(() => {
        if (currentChat?.ChatID) {
            loadChatHistory(currentChat.ChatID);
        }
    }, [currentChat]);

    const loadChatHistory = async (chatId: string) => {
        try {
            setIsLoading(true);
            const allMessages = await chatService.getMessages(chatId);
            
            // Asegurar que todos los mensajes tengan la hora del cliente y los campos correctos para FileAnalysisResult
            const messagesWithClientTime = allMessages.map((message: Message) => {
                let transformed = {
                    ...message,
                    createdAt: message.createdAt || new Date().toISOString()
                };
                // Si es respuesta de archivo, asegura los campos
                if (message.FileID && message.sendertype === 'ai') {
                    transformed = {
                        ...transformed,
                        contentAsk: message.contentAsk || message.question || '',
                        contentResponse: message.contentResponse || message.content || message.answer || '',
                        questionIndex: message.questionIndex || 0,
                        isLoading: false
                    };
                }
                return transformed;
            });

            setMessages(messagesWithClientTime);
        } catch (err) {
            console.error('Error loading chat history:', err);
            setError(err instanceof Error ? err.message : 'Error loading chat history');
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!currentChat?.ChatID) return;

        try {
            setIsLoading(true);
            setError(null);

            // 1. Crear y mostrar mensaje del usuario
            const userMessage: Message = {
                ChatID: currentChat.ChatID,
                contentAsk: content,
                sendertype: 'user',
                status: 'active',
                createdAt: new Date().toISOString()
            };

            // 2. Crear placeholder de IA con ID único
            const placeholderId = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const aiPlaceholder: Message = {
                ChatID: currentChat.ChatID,
                sendertype: 'ai',
                status: 'loading',
                createdAt: new Date().toISOString(),
                isLoading: true,
                MessageID: placeholderId
            };

            setMessages(prev => [...prev, userMessage, aiPlaceholder]);

            // 3. Enviar al backend y obtener respuesta
            const backendResponse = await chatService.sendMessage(currentChat.ChatID, content);
            const backendMessage: Message = {
                ...backendResponse,
                createdAt: new Date().toISOString(),
                isLoading: false
            };

            // 4. Reemplazar el placeholder por la respuesta real usando MessageID
            setMessages(prev => prev.map(msg =>
                msg.MessageID === placeholderId ? backendMessage : msg
            ));

        } catch (err) {
            console.error('Error sending message:', err);
            setError(err instanceof Error ? err.message : 'Error sending message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (file: FileProps) => {
        if (!currentChat) return;
        setSelectedFile(file);
        try {
            setIsLoading(true);
            setError(null);

            // 1. Enviar mensaje de archivo
            const fileMessage = await chatService.sendFileMessage(currentChat.ChatID, file.FileID);
            setMessages(prev => {
                const updated = [...prev, fileMessage];
        
                return updated;
            });

            // 2. Procesar preguntas predefinidas
            for (const [questionIndex, question] of predefinedQuestions.questions.entries()) {
                // 1. Placeholder
                const placeholderId = `loading-fileq-${questionIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const aiPlaceholder: Message = {
                    ChatID: currentChat.ChatID,
                    FileID: file.FileID,
                    sendertype: 'ai',
                    status: 'loading',
                    createdAt: new Date().toISOString(),
                    isLoading: true,
                    MessageID: placeholderId,
                    contentAsk: question.question,
                    questionIndex
                };
                setMessages(prev => {
                    const updated = [...prev, aiPlaceholder];
            
                    return updated;
                });

                // 2. Espera respuesta real
                const questionResponse = await chatService.sendMessage(
                    currentChat.ChatID,
                    question.question,
                    file.FileID
                );
                const backendMessage: Message = {
                    ...questionResponse,
                    FileID: file.FileID,
                    contentAsk: question.question,
                    questionIndex,
                    isLoading: false
                };

                // 3. Reemplaza el placeholder por la respuesta real
                setMessages(prev => {
                    const updated = prev.map(msg =>
                        msg.MessageID === placeholderId ? backendMessage : msg
                    );
            
                    return updated;
                });
            }
        } catch (err) {
            console.error('Error handling file:', err);
            setError(err instanceof Error ? err.message : 'Error handling file');
        } finally {
            setIsLoading(false);
        }
    };

    const loadChat = async (chatID: string) => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const resetChatState = () => {
        setSelectedFile(null);
        setMessages([]);
        setError(null);
        setIsAnalyzing(false);
        setIsLoading(false);
    };

    return {
        currentChat,
        messages,
        selectedFile,
        isAnalyzing,
        isLoading,
        error,
        setError,
        setIsAnalyzing,
        sendMessage,
        handleFileSelect,
        loadChat,
        loadChatHistory,
        resetChatState,
        setMessages
    };
}; 