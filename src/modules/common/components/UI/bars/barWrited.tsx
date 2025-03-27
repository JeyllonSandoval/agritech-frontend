import { useState, FormEvent } from 'react';
import ButtonAdjunt from '@/modules/common/components/UI/CompleButtons/ButtonAdjunt';
import ButtonSend from '@/modules/common/components/UI/CompleButtons/ButtonSend';
import ModalCreated from '../../modals/modalCreated';
import { FileProps } from '@/modules/common/hooks/getFiles';

interface BarWritedProps {
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
    onFileSelect?: (file: FileProps) => void;
}

export default function BarWrited({ onSendMessage, isLoading = false, onFileSelect }: BarWritedProps) {
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleFileSelect = (file: FileProps) => {
        if (onFileSelect) {
            onFileSelect(file);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full p-4 border-t border-white/10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        disabled={isLoading}
                        className="w-full text-sm px-4 pr-28 py-3 
                            bg-white/5 rounded-xl
                            text-white placeholder-white/50
                            border border-white/10 focus:border-emerald-500/50
                            outline-none transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-2 flex items-center gap-2">
                        <ButtonAdjunt onClick={() => setIsModalOpen(true)} />
                        <ButtonSend 
                            isLoading={isLoading}
                            disabled={!message.trim() || isLoading}
                        />
                    </div>
                </div>
            </form>

            <ModalCreated 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="file"
                mode="select"
                onFileSelect={handleFileSelect}
            />
        </>
    );
}
