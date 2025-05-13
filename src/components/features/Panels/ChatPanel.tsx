import { useChat } from '@/hooks/useChat';
import { useFileStore } from '@/store/fileStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '@/components/common/UI/buttons/buttonSelectFile';
import { sendMessage } from '@/services/messageService';
import { Message } from '@/types/message';
import { FileProps } from '@/hooks/getFiles';
import TableShowMessage from '@/components/common/UI/table/tableShowMessage';
import BarWrited from '@/components/common/UI/bars/barWrited';
import FileAnalysisResult from '@/components/common/UI/items/FileAnalysisResult';
import { useModal } from '@/context/modalContext';
import { useEffect } from 'react';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', ChatID?: string) => void;
    ChatID?: string | null;
}

export default function ChatPanel({ onPanelChange, ChatID }: ChatPanelProps) {
    const { 
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
    } = useChat({ ChatID });

    const { files } = useFileStore();
    const { openModal } = useModal();

    // Ensure chat is loaded when chatId changes
    useEffect(() => {
        if (ChatID && (!currentChat || currentChat.ChatID !== ChatID)) {
            loadChat(ChatID);
        }
    }, [ChatID, currentChat, loadChat]);

    const handleSendMessage = async (content: string) => {
        if (!currentChat) return;

        if (selectedFile) {
            setIsAnalyzing(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');
                const questions = (await import('@/data/predefinedQuestions.json')).default.questions;
                for (const q of questions) {
                    // Add a loading message for this question
                    const loadingMessage = {
                        MessageID: `${Date.now()}-${Math.random()}`,
                        ChatID: currentChat.ChatID,
                        FileID: selectedFile.FileID,
                        sendertype: 'ai',
                        contentAsk: q.question,
                        contentResponse: '',
                        createdAt: new Date().toISOString(),
                        status: 'loading',
                        isPredefinedQuestion: true,
                        isLoading: true
                    };
                    setMessages(prev => [...prev, loadingMessage as Message]);

                    // Send the message to the backend
                    const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/message`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            ChatID: currentChat.ChatID,
                            FileID: selectedFile.FileID,
                            sendertype: 'user',
                            contentAsk: q.question,
                            status: 'active',
                        })
                    });
                    const backendMessage = await response.json();
                    // Replace the loading message with the real response
                    setMessages(prev => prev.map(msg =>
                        msg.MessageID === loadingMessage.MessageID ? backendMessage : msg
                    ));
                }
                // Refresca mensajes tras enviar todos
                await loadChatHistory(currentChat.ChatID);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error analyzing document');
            } finally {
                setIsAnalyzing(false);
            }
        } else {
            // Normal message flow
            const newMessage: Message = {
                MessageID: Date.now().toString(),
                ChatID: currentChat.ChatID,
                sendertype: 'user',
                contentAsk: content,
                createdAt: new Date().toISOString(),
                status: 'active'
            };

            setMessages(prev => [...prev, newMessage]);
            setIsAnalyzing(true);

            try {
                const response = await sendMessage(currentChat.ChatID, content);
                setMessages(prev => [...prev, response]);
                // Refresca mensajes tras enviar
                await loadChatHistory(currentChat.ChatID);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error analyzing document');
                setMessages(prev => prev.filter(msg => msg.MessageID !== newMessage.MessageID));
            } finally {
                setIsAnalyzing(false);
            }
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
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="text-center space-y-4">
                    <p className="text-white/70 text-base sm:text-lg">
                        Please select a chat to start
                    </p>
                </div>
            </div>
        );
    }

    const welcomeContent = (
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8">
            <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white/90">
                        {currentChat.chatname}
                    </h1>
                </div>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                    Start your analysis by selecting a document to analyze. 
                    Our system will process the information and be ready to answer your questions.
                </p>
            </div>

            <ButtonSelectFile 
                setIsModalOpen={handleOpenFileSelect} 
                isFileSelected={!!selectedFile}
            />

            {selectedFile && (
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <p className="text-white/70 text-base sm:text-lg text-center">
                        File selected: <span className="font-medium">{selectedFile.FileName}</span>
                    </p>
                    {error && (
                        <p className="text-red-400 text-sm bg-red-400/10 px-3 sm:px-4 py-2 rounded-xl border border-red-400/20 text-center">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed left-0 right-0 top-[80px] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
            <div className="w-full lg:w-[60vw] h-full flex flex-col px-4 sm:px-6 md:px-8">
                {messages.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto pb-4">
                            <TableShowMessage 
                                messages={messages}
                                isLoading={isAnalyzing}
                                files={files}
                            />
                        </div>
                        <div className="sticky bottom-0">
                            <BarWrited 
                                onSendMessage={handleSendMessage}
                                isLoading={isAnalyzing}
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                        {welcomeContent}
                    </div>
                )}

                <ModalCreated />
            </div>
        </div>
    );
}
