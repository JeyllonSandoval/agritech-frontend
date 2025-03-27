import { useState, useEffect } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '../UI/buttons/buttonSelectFile';
import { analyzeDocument } from '@/modules/common/services/chatService';
import { ChatMessage } from '@/modules/common/types/chat';
import { FileProps } from '@/modules/common/hooks/getFiles';
import TableShowMessage from '../UI/table/tableShowMessage';
import BarWrited from '../UI/bars/barWrited';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function ChatPanel({ onPanelChange }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Efecto para limpiar estados cuando cambia el chat
    useEffect(() => {
        setSelectedFile(null);
        setMessages([]);
        setError(null);
        setIsAnalyzing(false);
    }, [currentChat]);

    // Efecto para cargar mensajes
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!currentChat?.ChatID) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/messages/${currentChat.ChatID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to load chat history');
                
                const allMessages = await response.json();
                
                // Si hay un archivo seleccionado, filtrar por ese archivo
                if (selectedFile) {
                    const filteredMessages = allMessages.filter(
                        (message: ChatMessage) => message.FileID === selectedFile.FileID
                    );
                    setMessages(filteredMessages);
                } else {
                    setMessages(allMessages);
                }
            } catch (err) {
                console.error('Error loading chat history:', err);
                setError('Failed to load chat history');
            }
        };

        loadChatHistory();
    }, [currentChat?.ChatID, selectedFile]);

    const handleAnalysis = async () => {
        if (!currentChat || !selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        const initialMessage: ChatMessage = {
            MessageID: Date.now().toString(),
            ChatID: currentChat.ChatID,
            FileID: selectedFile.FileID,
            content: "Primera pregunta: ¿Cuál es el contenido del PDF?",
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, initialMessage]);

        try {
            const response = await analyzeDocument({
                ChatID: currentChat.ChatID,
                FileID: selectedFile.FileID,
                content: initialMessage.content,
                sendertype: 'user'
            });

            setMessages(prev => [...prev, response]);
            onPanelChange('chat');
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Error analyzing document');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        if (!currentChat || !selectedFile) return;

        const newMessage: ChatMessage = {
            MessageID: Date.now().toString(),
            ChatID: currentChat.ChatID,
            FileID: selectedFile.FileID,
            content: `ASK USER: ${content}`,
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, newMessage]);
        setIsAnalyzing(true);

        try {
            const response = await analyzeDocument({
                ChatID: currentChat.ChatID,
                FileID: selectedFile.FileID,
                content: `ASK USER: ${content}`,
                sendertype: 'user'
            });

            setMessages(prev => [...prev, response]);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Error analyzing document');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileSelect = (file: FileProps) => {
        setSelectedFile(file);
    };

    if (!currentChat) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <p className="text-white/70 text-lg">
                        Please select a chat to start
                    </p>
                </div>
            </div>
        );
    }

    const welcomeContent = (
        <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-semibold text-white/90">
                        {currentChat.chatname}
                    </h1>
                    <span className="text-sm text-white/50">
                        ID: {currentChat.ChatID}
                    </span>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                    Start your analysis by selecting a document to analyze. 
                    Our system will process the information and be ready to answer your questions.
                </p>
            </div>

            <ButtonSelectFile 
                setIsModalOpen={setIsModalOpen} 
                isFileSelected={!!selectedFile}
            />

            {selectedFile && (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-white/70 text-lg">
                        File selected: <span className="font-medium">{selectedFile.FileName}</span>
                    </p>
                    {error && (
                        <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                            {error}
                        </p>
                    )}
                    <button
                        className="group relative px-6 py-3 bg-emerald-500 text-white rounded-xl
                            hover:bg-emerald-600 transition-all duration-300
                            flex items-center gap-2 text-2xl font-medium
                            shadow-lg shadow-emerald-500/20
                            overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAnalysis}
                        disabled={isAnalyzing}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent
                            transform animate-shimmer"
                            style={{
                                width: '200%'
                            }}
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-1/2 h-full flex flex-col">
                {messages.length > 0 ? (
                    // Si hay mensajes, mostrarlos junto con la barra de escritura
                    <>
                        <TableShowMessage 
                            messages={messages}
                            isLoading={isAnalyzing}
                        />
                        <BarWrited 
                            onSendMessage={handleSendMessage}
                            isLoading={isAnalyzing}
                            onFileSelect={handleFileSelect}
                        />
                    </>
                ) : (
                    // Si no hay mensajes, mostrar la pantalla de bienvenida o selección de archivo
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        {welcomeContent}
                    </div>
                )}

                <ModalCreated 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    type="file"
                    mode="select"
                    onFileSelect={(file: FileProps) => setSelectedFile(file)}
                />
            </div>
        </div>
    );
}
