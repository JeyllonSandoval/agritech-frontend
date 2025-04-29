import { useState, FormEvent } from 'react';
import ButtonAdjunt from '@/components/common/UI/CompleButtons/ButtonAdjunt';
import ButtonSend from '@/components/common/UI/CompleButtons/ButtonSend';
import { FileProps } from '@/hooks/getFiles';
import { useModal } from '@/context/modalContext';

interface BarWritedProps {
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
    onFileSelect?: (file: FileProps) => void;
    selectedFile?: FileProps | null;
}

export default function BarWrited({ 
    onSendMessage, 
    isLoading = false, 
    onFileSelect,
    selectedFile 
}: BarWritedProps) {
    const [message, setMessage] = useState('');
    const { openModal } = useModal();

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
    };

    const handleOpenFileSelect = () => {
        openModal('createdFile', 'select', '', undefined, undefined, handleFileSelect);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full p-4 border-t border-white/10">
            {selectedFile && (
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/50">
                        File selected: 
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                        {selectedFile.FileName}
                    </span>
                </div>
            )}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question..."
                    disabled={isLoading}
                    className="w-full text-sm px-4 pr-28 py-3 
                        bg-white/5 rounded-xl
                        text-white placeholder-white/50
                        border border-white/10 focus:border-emerald-500/50
                        outline-none transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-2 flex items-center gap-2">
                    <ButtonAdjunt onClick={handleOpenFileSelect} />
                    <ButtonSend 
                        isLoading={isLoading}
                        disabled={!message.trim() || isLoading}
                    />
                </div>
            </div>
        </form>
    );
}
