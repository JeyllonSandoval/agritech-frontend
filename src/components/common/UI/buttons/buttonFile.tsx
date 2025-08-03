import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface ButtonFileProps {
    onClick: () => void;
    collapsed?: boolean;
}

export default function ButtonFile({ onClick, collapsed = false }: ButtonFileProps) {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('buttons').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) return null;

    if (collapsed) {
        return (
            <button 
                onClick={onClick}
                className="group relative w-16 h-12
                    bg-gray-800/80 hover:bg-emerald-500/20
                    active:bg-emerald-600/30
                    backdrop-blur-sm rounded-xl
                    border border-emerald-500/30 hover:border-emerald-400/50
                    shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20
                    transition-all duration-300 ease-out
                    text-white
                    flex items-center justify-center
                    transform hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                title={t('navbarLateral.files')}
            >
                <svg className="w-5 h-5 transition-all duration-300 ease-out text-emerald-400
                    group-hover:scale-110 group-hover:text-emerald-300 group-hover:rotate-3" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>
        );
    }

    return (
        <button 
            onClick={onClick}
            className="group relative w-full px-4 py-3
                bg-gray-800/80 hover:bg-emerald-500/20
                active:bg-emerald-600/30
                backdrop-blur-sm rounded-xl
                border border-emerald-500/30 hover:border-emerald-400/50
                shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20
                transition-all duration-300 ease-out
                text-white
                flex items-center justify-center gap-3 text-sm font-medium
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
            <svg className="w-5 h-5 transition-all duration-300 ease-out text-emerald-400
                group-hover:scale-110 group-hover:text-emerald-300 group-hover:rotate-3" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white group-hover:text-emerald-300 transition-colors duration-300 ease-out">
                {t('navbarLateral.files')}
            </span>
        </button>
    );
}