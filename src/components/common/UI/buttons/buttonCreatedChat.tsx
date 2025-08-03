'use client';

import { useModal } from '@/context/modalContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface ButtonCreatedChatProps {
    onClick?: () => void;
    collapsed?: boolean;
}

export default function ButtonCreatedChat({ onClick, collapsed = false }: ButtonCreatedChatProps) {
    const { openModal } = useModal();
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('buttons').then(() => setIsLoaded(true));
    }, [language]);

    const handleClick = () => {
        openModal('createdChat', 'create', '');
        onClick?.();
    };

    if (!isLoaded) return null;

    if (collapsed) {
        return (
            <button 
                onClick={handleClick}
                className="group relative w-16 h-12 
                    bg-emerald-600/80 hover:bg-emerald-500/80
                    active:bg-emerald-700/80
                    border border-emerald-500/30 hover:border-emerald-400/50
                    shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30
                    backdrop-blur-md
                    transition-all duration-300 ease-out
                    flex items-center justify-center rounded-xl
                    transform hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                title={t('createChat')}
            >
                <svg className="w-5 h-5 text-white group-hover:text-gray-200 
                    transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-90" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        );
    }

    return (
        <button 
            onClick={handleClick}
            className="group relative w-full px-4 py-3 
                bg-emerald-600/80 hover:bg-emerald-500/80
                active:bg-emerald-700/80
                border border-emerald-500/30 hover:border-emerald-400/50
                shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30
                backdrop-blur-md
                transition-all duration-300 ease-out
                flex items-center justify-center gap-3 rounded-xl text-sm font-medium
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
            <svg className="w-5 h-5 text-white group-hover:text-gray-200 
                transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-90" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-white group-hover:text-gray-200 transition-colors duration-300 ease-out">
                {t('createChat')}
            </span>
        </button>
    );
}
