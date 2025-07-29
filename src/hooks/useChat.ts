import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import { jwtDecode } from 'jwt-decode';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { language } = useLanguage();
    const { t } = useTranslation();

    // Cargar historial inicial
    useEffect(() => {
        if (currentChat?.ChatID) {
            // Resetear el archivo seleccionado cuando se carga un nuevo chat
            setSelectedFile(null);
            loadChatHistory(currentChat.ChatID);
        }
    }, [currentChat]);

    const loadChatHistory = async (chatId: string) => {
        try {
            console.log(`🔍 [useChat] Cargando historial del chat: ${chatId}`);
            setIsLoading(true);
            setError(null); // Limpiar errores previos
            
            const allMessages = await chatService.getMessages(chatId);
            console.log(`🔍 [useChat] Mensajes recibidos:`, allMessages.length, allMessages);
            
            // Asegurar que todos los mensajes tengan la hora del cliente
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
                        isLoading: false
                    };
                }
                return transformed;
            });

            console.log(`🔍 [useChat] Mensajes transformados:`, messagesWithClientTime.length);
            setMessages(messagesWithClientTime);
            
            // Si no hay mensajes, también es un estado válido
            if (messagesWithClientTime.length === 0) {
                console.log(`🔍 [useChat] Chat sin mensajes - estado limpio`);
            }
        } catch (err) {
            console.error('🔥 [useChat] Error loading chat history:', err);
            setError(err instanceof Error ? err.message : 'Error loading chat history');
            // En caso de error, asegurar que el estado esté limpio
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!currentChat?.ChatID) return;

        try {
            setIsLoading(true);
            setError(null);

            // Determinar si este mensaje debe usar un archivo
            const isDeviceData = content.includes('Datos del Dispositivo:');
            const shouldUseFile = !isDeviceData && selectedFile && content.trim() !== '';
            const fileId = shouldUseFile ? selectedFile.FileID : undefined;
            
            // Limpiar archivo seleccionado INMEDIATAMENTE después de usarlo para este mensaje
            if (!isDeviceData) {
                setSelectedFile(null);
            }

            // 1. Crear y mostrar mensaje del usuario (SIN información de archivo local)
            const userMessage: Message = {
                ChatID: currentChat.ChatID,
                contentAsk: content,
                sendertype: 'user',
                status: 'active',
                createdAt: new Date().toISOString()
                // NO incluir FileID ni contentFile aquí - solo para mostrar el mensaje
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
            
            console.log(`Enviando mensaje con content: "${content}", fileId: ${fileId}, shouldUseFile: ${shouldUseFile}, selectedFile: ${selectedFile?.FileName}`);
            
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
                contentAsk: language === 'es' ? 'Genera un resumen ejecutivo del documento' : 'Generate an executive summary of the document'
            };
            setMessages(prev => {
                const updated = [...prev, summaryPlaceholder];
        
                return updated;
            });

            // 3. Espera respuesta real del resumen - Asegurar que se pase el FileID
            const summaryResponse = await chatService.sendMessage(
                currentChat.ChatID,
                language === 'es' ? 'Genera un resumen ejecutivo del documento' : 'Generate an executive summary of the document',
                file.FileID // Pasar el FileID para que el backend procese el contenido
            );
            const summaryMessage: Message = {
                ...summaryResponse,
                FileID: file.FileID,
                contentAsk: language === 'es' ? 'Resumen ejecutivo del documento' : 'Executive summary of the document',
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