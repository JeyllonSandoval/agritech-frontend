import { useChat } from '@/hooks/useChat';
import { useFileStore } from '@/store/fileStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '@/components/common/UI/buttons/buttonSelectFile';
import TableShowMessage from '@/components/common/UI/table/tableShowMessage';
import BarWrited from '@/components/common/UI/bars/barWrited';
import DeviceDataMessage from '@/components/common/UI/items/DeviceDataMessage';
import { useModal } from '@/context/modalContext';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfile } from '@/hooks/useProfile';
import { Message } from '@/types/message';
import ChatDeviceSelector from '../telemetry/ChatDeviceSelector';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', ChatID?: string) => void;
    ChatID?: string | null;
}

export default function ChatPanel({ onPanelChange, ChatID }: ChatPanelProps) {
    const [showDeviceSelector, setShowDeviceSelector] = useState(false);
    
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
        loadChatHistory,
        setMessages
    } = useChat({ ChatID });

    const { files, fetchFiles } = useFileStore();
    const { openModal } = useModal();
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const { userData, countryName } = useProfile();

    // Ensure chat is loaded when chatId changes
    useEffect(() => {
        if (ChatID && (!currentChat || currentChat.ChatID !== ChatID)) {
            loadChat(ChatID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ChatID]);

    // Load chat history when currentChat changes OR when ChatID is available
    useEffect(() => {
        const chatIdToLoad = currentChat?.ChatID || ChatID;
        if (chatIdToLoad) {
            loadChatHistory(chatIdToLoad);
            // Cargar archivos cuando se carga un chat
            fetchFiles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, ChatID]);

    useEffect(() => {
        loadTranslations('chatPanel');
    }, [language]);

    const handleSendMessage = async (content: string) => {
        // Permitir enviar aunque aún no se haya cargado currentChat usando fallback en useChat
        await sendMessage(content);
    };

    const handleOpenFileSelect = () => {
        openModal('createdFile', 'select', '', undefined, undefined, (file) => {
            handleFileSelect(file);
        });
    };

    const handleDeviceDataSend = (deviceData: string) => {
        console.log('🔍 [ChatPanel] handleDeviceDataSend llamado con:', {
            deviceDataLength: deviceData.length,
            containsDeviceData: deviceData.includes('Datos del Dispositivo:'),
            currentChatId: currentChat?.ChatID || ChatID
        });
        
        // Enviar como mensaje normal de usuario SIN FileID para que se guarde en la DB
        // No pasar FileID para que no se asocie con un archivo
        sendMessage(deviceData);
    };

    const handleShowDeviceSelector = () => {
        setShowDeviceSelector(true);
    };

    const handleCloseDeviceSelector = () => {
        setShowDeviceSelector(false);
    };

    // Mostrar el panel siempre, incluso si currentChat aún no está listo

    const welcomeContent = (
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8">
            <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white/90">
                        {currentChat?.chatname || 'Chat'}
                    </h1>
                </div>
                
                {/* Mensaje personalizado mejorado */}
                {userData && (
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-6">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold text-emerald-300 mb-2">
                            {userData.FirstName && countryName 
                                ? `¡Bienvenido, ${userData.FirstName}!`
                                : '¡Bienvenido!'
                            }
                        </h2>
                        <p className="text-white/70 text-sm leading-relaxed mb-3">
                            {userData.FirstName && countryName 
                                ? `Estoy listo para asistirte en tu nueva experiencia, respondere de forma personalizada y unica como tu pais ${countryName}.`
                                : 'Estoy listo para asistirte en tu nueva experiencia, puedes preguntarme directamente o subir un documento para análisis.'
                            }
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/60">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('features.documentAnalysis')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('features.expertRecommendations')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('features.cultivationTips')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('features.problemSolving')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ButtonSelectFile 
                        setIsModalOpen={handleOpenFileSelect} 
                        isFileSelected={!!selectedFile}
                    />
                    
                    {/* Botón para seleccionar dispositivo */}
                    <button
                        onClick={handleShowDeviceSelector}
                        className="w-full px-6 py-3 text-sm font-medium
                            bg-emerald-500/20 backdrop-blur-sm rounded-xl
                            border border-emerald-400/30 text-emerald-400
                            hover:bg-emerald-500/30 hover:text-emerald-300
                            transition-all duration-300
                            flex items-center justify-center gap-2"
                    >
                        <DevicePhoneMobileIcon className="w-5 h-5" />
                        Seleccionar Dispositivo
                    </button>
                </div>
                
                {/* Botón para comenzar sin archivo */}
                <button
                    onClick={() => {
                        // Crear mensaje de bienvenida de la IA directamente
                        const welcomeMessage: Message = {
                            ChatID: currentChat?.ChatID || ChatID || '',
                            sendertype: 'ai',
                            status: 'active',
                            createdAt: new Date().toISOString(),
                            contentResponse: userData?.FirstName 
                                ? `¡Hola ${userData.FirstName}! Soy tu asistente de agricultura. Estoy aquí para ayudarte con cualquier pregunta sobre cultivos, riego, sensores, documentos agrícolas o cualquier tema relacionado con la agricultura. ¿En qué puedo ayudarte hoy?`
                                : `¡Hola! Soy tu asistente de agricultura. Estoy aquí para ayudarte con cualquier pregunta sobre cultivos, riego, sensores, documentos agrícolas o cualquier tema relacionado con la agricultura. ¿En qué puedo ayudarte hoy?`
                        };
                        
                        // Agregar el mensaje directamente al estado
                        setMessages((prev: Message[]) => [...prev, welcomeMessage]);
                    }}
                    className="w-full px-6 py-3 text-sm font-medium
                        bg-white/10 backdrop-blur-sm rounded-xl
                        border border-white/20 text-white/70
                        hover:bg-white/20 hover:text-white
                        transition-all duration-300
                        flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t('startConversation')}
                </button>
            </div>

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
        <>
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
                                    onDeviceSelect={handleShowDeviceSelector}
                                    isDeviceSelectorActive={showDeviceSelector}
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

            {/* Chat Device Selector - Siempre visible cuando está activado */}
            {showDeviceSelector && (
                <div className="fixed right-2 top-20 z-50">
                    <ChatDeviceSelector
                        onDeviceDataSend={handleDeviceDataSend}
                        onClose={handleCloseDeviceSelector}
                    />
                </div>
            )}
        </>
    );
}
