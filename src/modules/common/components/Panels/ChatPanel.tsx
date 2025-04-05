import { useState, useEffect } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import { useFileStore } from '@/modules/common/stores/fileStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '../UI/buttons/buttonSelectFile';
import { analyzeDocument } from '@/modules/common/services/chatService';
import { AnalysisRequest, ChatMessage } from '@/modules/common/types/chat';
import { FileProps } from '@/modules/common/hooks/getFiles';
import TableShowMessage from '../UI/table/tableShowMessage';
import BarWrited from '../UI/bars/barWrited';
import FileAnalysisResult from '../UI/items/FileAnalysisResult';
import predefinedQuestions from '@/modules/common/data/predefinedQuestions.json';
import { useModal } from '@/modules/common/context/modalContext';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function ChatPanel({ onPanelChange }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const { files, fetchFiles } = useFileStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { openModal } = useModal();

    useEffect(() => {
        setSelectedFile(null);
        setMessages([]);
        setError(null);
        setIsAnalyzing(false);
    }, [currentChat]);

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
                
                // Procesar los mensajes para mantener la estructura de análisis
                const processedMessages = allMessages.reduce((acc: ChatMessage[], message: ChatMessage, index: number) => {
                    // Si es un mensaje de archivo, solo lo agregamos si no hay otro mensaje de archivo reciente
                    if (message.FileID && message.sendertype === 'user') {
                        const lastFileMessage = acc.findLast(m => m.FileID && m.sendertype === 'user');
                        if (!lastFileMessage || lastFileMessage.FileID !== message.FileID) {
                            acc.push(message);
                        }
                    }
                    // Si es una respuesta de la IA, la procesamos
                    else if (message.sendertype === 'ai') {
                        const previousMessage = allMessages[index - 1];
                        if (previousMessage) {
                            const matchingQuestion = predefinedQuestions.questions.find(q => 
                                previousMessage.content.includes(q.question) || 
                                previousMessage.content.includes(q.description)
                            );

                            if (matchingQuestion) {
                                acc.push({
                                    ...message,
                                    question: matchingQuestion.question,
                                    description: matchingQuestion.description
                                });
                            } else {
                                acc.push(message);
                            }
                        } else {
                            acc.push(message);
                        }
                    }
                    // Para otros tipos de mensajes, los agregamos directamente
                    else {
                        acc.push(message);
                    }
                    return acc;
                }, []);

                setMessages(processedMessages);
            } catch (err) {
                console.error('Error loading chat history:', err);
                setError('Failed to load chat history');
            }
        };

        loadChatHistory();
    }, [currentChat?.ChatID]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileSelect = async (file: FileProps) => {
        setSelectedFile(file);
        setIsAnalyzing(true);
        setError(null);

        // Agregar mensaje de archivo seleccionado
        const fileMessage: ChatMessage = {
            MessageID: `file-${Date.now()}`,
            ChatID: currentChat!.ChatID,
            FileID: file.FileID,
            content: 'ASK USER',
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, fileMessage]);

        // Procesar cada pregunta
        for (const question of predefinedQuestions.questions) {
            try {
                const response = await analyzeDocument({
                    ChatID: currentChat!.ChatID,
                    FileID: file.FileID,
                    content: question.question,
                    sendertype: 'user'
                });

                // Agregar cada resultado como un mensaje
                const analysisMessage: ChatMessage = {
                    MessageID: `analysis-${question.id}-${Date.now()}`,
                    ChatID: currentChat!.ChatID,
                    FileID: file.FileID,
                    content: response.content,
                    sendertype: 'ai',
                    createdAt: new Date().toISOString(),
                    status: 'active',
                    question: question.question,
                    description: question.description
                };

                setMessages(prev => [...prev, analysisMessage]);
            } catch (err) {
                console.error(`Error analyzing question ${question.id}:`, err);
                setError(err instanceof Error ? err.message : 'Error analyzing document');
            }
        }

        setIsAnalyzing(false);
    };

    const handleSendMessage = async (content: string) => {
        if (!currentChat) return;

        const newMessage: ChatMessage = {
            MessageID: Date.now().toString(),
            ChatID: currentChat.ChatID,
            FileID: null,
            content: content,
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, newMessage]);
        setIsAnalyzing(true);

        try {
            const requestData = {
                ChatID: currentChat.ChatID,
                content: content,
                sendertype: 'user' as const
            };

            console.log('Enviando mensaje:', requestData);

            const response = await analyzeDocument(requestData as AnalysisRequest);
            setMessages(prev => [...prev, response]);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Error analyzing document');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOpenFileSelect = () => {
        if (!currentChat) {
            console.error('No chat selected');
            return;
        }
        openModal('createdFile', 'select', '', undefined, undefined, (file) => {
            handleFileSelect(file);
        });
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
                setIsModalOpen={handleOpenFileSelect} 
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
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-3/5 h-full flex flex-col">
                {messages.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto">
                            <TableShowMessage 
                                messages={messages}
                                isLoading={isAnalyzing}
                                files={files}
                            />
                        </div>
                        <BarWrited 
                            onSendMessage={handleSendMessage}
                            isLoading={isAnalyzing}
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        {welcomeContent}
                    </div>
                )}

                <ModalCreated />
            </div>
        </div>
    );
}
