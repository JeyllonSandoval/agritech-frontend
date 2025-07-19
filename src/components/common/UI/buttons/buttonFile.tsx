import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface ButtonFileProps {
    onClick: () => void;
}

export default function ButtonFile({ onClick }: ButtonFileProps) {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('buttons').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) return null;

    return (
        <button 
            onClick={onClick}
            className="group relative w-full px-4 py-3 
                bg-gradient-to-r from-gray-700/30 to-gray-500/30
                hover:from-gray-600/30 hover:to-gray-400/30
                active:from-gray-800/30 active:to-gray-600/30
                backdrop-blur-sm rounded-xl
                border border-emerald-400/30
                shadow-lg shadow-emerald-500/20
                transition-all duration-300
                text-white
                flex items-center justify-center gap-2 text-sm font-medium"
        >
            <svg className="w-5 h-5 transition-transform duration-300 text-emerald-400
                group-hover:scale-110 group-hover:rotate-6" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-emerald-300">{t('Document')}</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 
                blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
        </button>
    );
}