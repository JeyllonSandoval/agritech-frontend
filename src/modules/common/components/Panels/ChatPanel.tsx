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
import FileAnalysisResult from '../items/FileAnalysisResult';
import predefinedQuestions from '@/modules/common/data/predefinedQuestions.json';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function ChatPanel({ onPanelChange }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const { files, fetchFiles } = useFileStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                setMessages(allMessages); // Ya no filtramos por FileID
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

    const handleAnalysis = async () => {
        if (!currentChat || !selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        // Agregar mensaje de archivo seleccionado
        const fileMessage: ChatMessage = {
            MessageID: `file-${Date.now()}`,
            ChatID: currentChat.ChatID,
            FileID: selectedFile.FileID,
            content: 'ASK USER',
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, fileMessage]);

        // Agregar mensaje inicial de análisis
        const analysisStartMessage: ChatMessage = {
            MessageID: `analysis-start-${Date.now()}`,
            ChatID: currentChat.ChatID,
            FileID: selectedFile.FileID,
            content: `Starting analysis of ${selectedFile.FileName}`,
            sendertype: 'ai',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, analysisStartMessage]);

        // Procesar cada pregunta
        for (const question of predefinedQuestions.questions) {
            try {
                const response = await analyzeDocument({
                    ChatID: currentChat.ChatID,
                    FileID: selectedFile.FileID,
                    content: question.question,
                    sendertype: 'user'
                });

                // Agregar cada resultado como un mensaje
                const analysisMessage: ChatMessage = {
                    MessageID: `analysis-${question.id}-${Date.now()}`,
                    ChatID: currentChat.ChatID,
                    FileID: selectedFile.FileID,
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

        // Agregar mensaje inicial de análisis
        const analysisStartMessage: ChatMessage = {
            MessageID: `analysis-start-${Date.now()}`,
            ChatID: currentChat!.ChatID,
            FileID: file.FileID,
            content: `Starting analysis of ${file.FileName}`,
            sendertype: 'ai',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, analysisStartMessage]);

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
            <div className="w-3/5 h-full flex flex-col">
                {messages.length > 0 ? (
                    <>
                        <TableShowMessage 
                            messages={messages}
                            isLoading={isAnalyzing}
                            files={files}
                        />
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
