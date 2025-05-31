'use client';

import { useModal } from '@/context/modalContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

export default function ButtonEditProfile() {
    const { openModal } = useModal();
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
            onClick={() => openModal('edit-profile', 'edit', '', undefined, undefined, undefined, undefined)}
            className="px-4 py-2 rounded-xl text-xs lg:text-sm
                bg-gradient-to-br from-emerald-400/40 to-emerald-600/40
                border border-emerald-400/30
                shadow-lg shadow-emerald-400/20
                backdrop-blur-md
                hover:from-emerald-400/60 hover:to-emerald-600/60
                hover:border-emerald-400/50 hover:text-white
                hover:shadow-emerald-400/30
                active:scale-95
                transition-all duration-300
                flex items-center gap-3"
        >
            <svg className="w-5 h-5 transition-transform duration-300
                group-hover:rotate-12" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('editProfile')}
        </button>
    );
}
