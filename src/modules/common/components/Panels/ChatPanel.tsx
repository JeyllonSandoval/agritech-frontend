import { useState } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '../UI/buttons/buttonSelectFile';
import { analyzeDocument } from '@/modules/common/services/chatService';
import { ChatMessage } from '@/modules/common/types/chat';
import { FileProps } from '@/modules/common/hooks/getFiles';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function ChatPanel({ onPanelChange }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalysis = async () => {
        if (!currentChat || !selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            console.log('Starting analysis with:', {
                FileID: selectedFile.FileID,
                ChatID: currentChat.ChatID
            });

            const response = await analyzeDocument({
                ChatID: currentChat.ChatID,
                FileID: selectedFile.FileID,
                content: "Primera pregunta: ¿Cuál es el contenido del PDF?",
                sendertype: 'user'
            });

            console.log('Analysis response:', response);
            
            if (response.sendertype === 'ai') {
                onPanelChange('chat');
            } else {
                throw new Error('Invalid response from server');
            }
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

    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl w-full space-y-8">
                    {/* Título y descripción */}
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

                    {/* Botón para seleccionar archivo */}
                    <ButtonSelectFile 
                        setIsModalOpen={setIsModalOpen} 
                        isFileSelected={!!selectedFile}
                    />

                    {/* Mostrar el nombre del archivo seleccionado y botón de análisis */}
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
            </div>

            <ModalCreated 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="file"
                mode="select"
                onFileSelect={(file: FileProps) => setSelectedFile(file)}
            />
        </>
    );
}
