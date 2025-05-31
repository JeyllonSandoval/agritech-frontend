import { useState, FormEvent, useEffect } from 'react';
import ButtonAdjunt from '@/components/common/UI/CompleButtons/ButtonAdjunt';
import ButtonSend from '@/components/common/UI/CompleButtons/ButtonSend';
import { FileProps } from '@/hooks/getFiles';
import { useModal } from '@/context/modalContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

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
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('bars').then(() => setIsLoaded(true));
    }, [language]);

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

    if (!isLoaded) return null;

    return (
        <form onSubmit={handleSubmit} className="p-2">
            <div className="flex flex-col w-full gap-1">
                {selectedFile && (
                    <div className="flex items-center gap-2 w-full !mb-0">
                        <span className="text-xs text-white/50 whitespace-nowrap">
                            {t('fileSelected')}
                        </span>
                        <span className="text-xs text-emerald-400 font-medium truncate max-w-[50vw] sm:max-w-[70vw]">
                            {selectedFile.FileName}
                        </span>
                    </div>
                )}
                <div className="relative w-full">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('writeQuestion')}
                        disabled={isLoading}
                        className="w-full text-sm px-3 sm:px-4 pr-16 sm:pr-24 py-1 sm:py-2 
                            bg-white/5 rounded-xl
                            text-white placeholder-white/50
                            border border-white/10 focus:border-emerald-500/50
                            outline-none transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed
                            block leading-none h-[50px] m-0"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                        <ButtonAdjunt onClick={handleOpenFileSelect} disabled={isLoading} />
                        <ButtonSend 
                            isLoading={isLoading}
                            disabled={!message.trim() || isLoading}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
