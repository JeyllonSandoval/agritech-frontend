import { useChat } from '@/hooks/useChat';
import { useFileStore } from '@/store/fileStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '@/components/common/UI/buttons/buttonSelectFile';
import TableShowMessage from '@/components/common/UI/table/tableShowMessage';
import BarWrited from '@/components/common/UI/bars/barWrited';
import { useModal } from '@/context/modalContext';
import { useEffect } from 'react';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

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
        isLoading,
        error,
        setError,
        setIsAnalyzing,
        sendMessage,
        handleFileSelect,
        loadChat,
        loadChatHistory
    } = useChat({ ChatID });

    const { files } = useFileStore();
    const { openModal } = useModal();
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();

    // Ensure chat is loaded when chatId changes
    useEffect(() => {
        if (ChatID && (!currentChat || currentChat.ChatID !== ChatID)) {
            loadChat(ChatID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ChatID]);

    useEffect(() => {
        loadTranslations('chatPanel');
    }, [language]);

    const handleSendMessage = async (content: string) => {
        if (!currentChat) return;
        await sendMessage(content);
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
            <div className="fixed left-0 right-0 top-[80px] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-white/70 text-base sm:text-lg">
                        {t('selectChat')}
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
                    {t('startAnalysis')}
                </p>
            </div>

            <ButtonSelectFile 
                setIsModalOpen={handleOpenFileSelect} 
                isFileSelected={!!selectedFile}
            />

            {selectedFile && (
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <p className="text-white/70 text-base sm:text-lg text-center">
                        {t('fileSelected')}: <span className="font-medium">{selectedFile.FileName}</span>
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
                                isLoading={isLoading || isAnalyzing}
                                files={files}
                            />
                        </div>
                        <div className="sticky bottom-0">
                            <BarWrited 
                                onSendMessage={handleSendMessage}
                                isLoading={isLoading || isAnalyzing}
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
