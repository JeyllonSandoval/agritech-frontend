import { useState } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import ModalCreated from '../modals/modalCreated';
import ButtonSelectFile from '../UI/buttons/buttonSelectFile';

interface ChatPanelProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function ChatPanel({ onPanelChange }: ChatPanelProps) {
    const currentChat = useChatStore(state => state.currentChat);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

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
                    <ButtonSelectFile setIsModalOpen={setIsModalOpen} />
                </div>
            </div>

            <ModalCreated 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="file"
                mode="select"
            />
        </>
    );
}
