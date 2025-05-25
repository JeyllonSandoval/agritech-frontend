import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface FileAnalysisResultProps {
    question: string;
    description: string;
    answer: string;
    isLoading?: boolean;
}

export default function FileAnalysisResult({ 
    question, 
    description, 
    answer, 
    isLoading 
}: FileAnalysisResultProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('items').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) return null;

    return (
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-4 mb-2 sm:mb-4 border border-gray-700/30 hover:border-gray-600/50 transition-colors duration-200 w-full">
            <div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer group gap-2 sm:gap-0"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-medium text-white/90 group-hover:text-white transition-colors duration-200 break-words whitespace-normal">
                        {question}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 group-hover:text-white/70 transition-colors duration-200 break-words whitespace-normal">
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-xs text-white/40">
                        {isExpanded ? t('hide') : t('viewMore')}
                    </span>
                    <svg 
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-white/50 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <div 
                className={`grid transition-all duration-200 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-700/30' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    {isLoading && (!answer || answer.trim() === '') ? (
                        <div className="flex items-center space-x-2 py-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '1s' }} />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.4s' }} />
                        </div>
                    ) : (
                        <p className="text-white/80 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                            {answer && answer.trim() !== '' ? answer : t('waiting System')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
} 