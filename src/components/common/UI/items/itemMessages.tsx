import { Message } from '@/types/message';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface ItemMessageProps extends Pick<Message, 'sendertype' | 'createdAt'> {
    content?: string;
    contentAsk?: string;
    contentResponse?: string;
    contentFile?: string;
    isNew?: boolean;
    fileInfo?: {
        FileName: string;
    };
    isLoading?: boolean;
}

export default function ItemMessage({ content, contentAsk, contentResponse, contentFile, sendertype, createdAt, isNew, fileInfo, isLoading }: ItemMessageProps) {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('items').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) return null;

    const formattedDate = createdAt ? new Date(createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) : '';
    const isUser = sendertype === 'user';

    const displayContent =
        content ??
        contentAsk ??
        contentResponse ??
        contentFile ??
        '';

    // Estilos compactos para loading
    const loadingBubbleClass = "bg-white/5 border border-white/20 rounded-lg px-2 py-1 flex items-center space-x-1 min-h-0 min-w-0 shadow-none";
    const fileBubbleClass = `max-w-[80%] rounded-lg p-3 sm:p-4 bg-white/5 border border-emerald-400/30 text-white/90 flex flex-col ${isNew ? 'animate-fade-in' : ''}`;
    const normalBubbleClass = `max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-lg shadow-emerald-900/10 relative overflow-hidden transition-all duration-300 group ${
        isUser 
            ? 'bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-emerald-700/60 border border-emerald-400/30 text-white backdrop-blur-md'
            : 'bg-gradient-to-br from-white/10 via-gray-800/30 to-gray-700/30 border border-white/20 text-white/90 backdrop-blur-md'
    } ${isNew ? 'animate-fade-in' : ''}`;

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={isLoading ? loadingBubbleClass : fileInfo ? fileBubbleClass : normalBubbleClass + ' group-hover:shadow-emerald-400/20'}>
                {/* Texto secundario arriba */}
                {fileInfo && !isLoading && (
                    <div className="text-xs text-white/50 font-normal">
                        {t('noMessages')}
                    </div>
                )}
                {isLoading ? (
                    <div className="flex items-center space-x-1 text-sm lg:text-base p-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
                    </div>
                ) : (
                    !fileInfo && displayContent && (
                        <p className="text-sm sm:text-base">{displayContent}</p>
                    )
                )}
                
                {fileInfo && !isLoading && (
                    <div className="flex items-center gap-2 text-base font-semibold text-emerald-400">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{fileInfo.FileName}</span>
                    </div>
                )}
                {!isLoading && (
                    <div className="mt-2 text-xs text-white/50">
                        {formattedDate}
                    </div>
                )}
            </div>
        </div>
    );
}
