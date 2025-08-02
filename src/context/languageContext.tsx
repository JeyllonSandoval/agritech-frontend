'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load saved language preference from localStorage
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
                setLanguage(savedLanguage);
            }
        }
        setIsInitialized(true);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isInitialized }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 