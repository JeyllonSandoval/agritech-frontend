import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import { jwtDecode } from 'jwt-decode';

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

            // 3. Enviar al backend y obtener respuesta - Incluir FileID si hay archivo seleccionado
            const fileId = selectedFile?.FileID;
            const backendResponse = await chatService.sendMessage(currentChat.ChatID, content, fileId);
            const backendMessage: Message = {
                ...backendResponse,
                createdAt: new Date().toISOString(),
                isLoading: false,
                // Asegurar que el tipo de contenido sea correcto
                contentAsk: backendResponse.sendertype === 'user' ? backendResponse.contentAsk : undefined,
                contentResponse: backendResponse.sendertype === 'ai' ? backendResponse.contentResponse : undefined
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

            // 2. Generar resumen automático del PDF con el FileID incluido
            const summaryPlaceholderId = `loading-summary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const summaryPlaceholder: Message = {
                ChatID: currentChat.ChatID,
                FileID: file.FileID,
                sendertype: 'ai',
                status: 'loading',
                createdAt: new Date().toISOString(),
                isLoading: true,
                MessageID: summaryPlaceholderId,
                contentAsk: 'Genera un resumen ejecutivo del documento',
                questionIndex: 0
            };
            setMessages(prev => {
                const updated = [...prev, summaryPlaceholder];
        
                return updated;
            });

            // 3. Espera respuesta real del resumen - Asegurar que se pase el FileID
            const summaryResponse = await chatService.sendMessage(
                currentChat.ChatID,
                'Genera un resumen ejecutivo del documento',
                file.FileID // Pasar el FileID para que el backend procese el contenido
            );
            const summaryMessage: Message = {
                ...summaryResponse,
                FileID: file.FileID,
                contentAsk: 'Resumen ejecutivo del documento',
                questionIndex: 0,
                isLoading: false
            };

            // 4. Reemplaza el placeholder por la respuesta real
            setMessages(prev => {
                const updated = prev.map(msg =>
                    msg.MessageID === summaryPlaceholderId ? summaryMessage : msg
                );
        
                return updated;
            });
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