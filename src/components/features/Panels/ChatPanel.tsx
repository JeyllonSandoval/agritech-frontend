import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useFileStore } from '@/store/fileStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '@/components/common/UI/buttons/buttonSelectFile';
import { analyzeDocument } from '@/services/chatService';
import { AnalysisRequest, ChatMessage } from '@/types/chat';
import { FileProps } from '@/hooks/getFiles';
import TableShowMessage from '@/components/common/UI/table/tableShowMessage';
import BarWrited from '@/components/common/UI/bars/barWrited';
import FileAnalysisResult from '@/components/common/UI/items/FileAnalysisResult';
import predefinedQuestions from '@/data/predefinedQuestions.json';
import { useModal } from '@/context/modalContext';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', chatId?: string) => void;
    chatId?: string | null;
}

export default function ChatPanel({ onPanelChange, chatId }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const { files, fetchFiles } = useFileStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { openModal } = useModal();

    useEffect(() => {
        if (chatId) {
            // Cargar el chat específico cuando se proporciona un chatId
            const loadChat = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chats/${chatId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    
                    if (!response.ok) throw new Error('Failed to load chat');
                    
                    const chat = await response.json();
                    setCurrentChat(chat);
                } catch (err) {
                    console.error('Error loading chat:', err);
                    setError(err instanceof Error ? err.message : 'Error loading chat');
                }
            };
            loadChat();
        }
    }, [chatId, setCurrentChat]);

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
                
                const processedMessages = allMessages.reduce((acc: ChatMessage[], message: ChatMessage, index: number) => {
                    if (message.FileID && message.sendertype === 'user') {
                        const lastFileMessage = acc.findLast(m => m.FileID && m.sendertype === 'user');
                        if (!lastFileMessage || lastFileMessage.FileID !== message.FileID) {
                            acc.push({
                                ...message,
                                content: 'New file selected'
                            });
                        }
                    } else {
                        acc.push(message);
                    }
                    return acc;
                }, []);

                setMessages(processedMessages);
            } catch (err) {
                console.error('Error loading chat history:', err);
                setError(err instanceof Error ? err.message : 'Error loading chat history');
            }
        };

        loadChatHistory();
    }, [currentChat]);

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

    const handleFileSelect = (file: FileProps) => {
        if (!currentChat) return;
        setSelectedFile(file);
        
        const newMessage: ChatMessage = {
            MessageID: Date.now().toString(),
            ChatID: currentChat.ChatID,
            FileID: file.FileID,
            content: 'New file selected',
            sendertype: 'user',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        setMessages(prev => [...prev, newMessage]);
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
