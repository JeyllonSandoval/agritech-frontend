import { useModal } from '@/context/modalContext';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    
    useEffect(() => {
        loadTranslations('modals');
    }, [language]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onCancel}
        >
            <div 
                className="bg-gray-100/10 backdrop-blur-md rounded-2xl 
                    border border-white/20 shadow-lg
                    p-8 relative w-full max-w-md
                    flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-500/20">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                            {t('confirmDelete')}
                        </h2>
                    </div>
                    <p className="text-white/70 text-sm">
                        {message}
                    </p>
                    <div className="flex justify-end gap-4 mt-4 text-xl">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg bg-white/10 text-white/70
                                hover:bg-white/20 hover:text-white/90
                                transition-all duration-300"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400
                                hover:bg-red-500/30 hover:text-red-300
                                transition-all duration-300
                                flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('delete')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 