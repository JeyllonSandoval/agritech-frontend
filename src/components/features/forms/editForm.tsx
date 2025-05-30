'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface EditFormProps {
    initialValue: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
    type: 'updateFile' | 'updateChat';
    itemId?: string;
}

export const EditForm: React.FC<EditFormProps> = ({
    initialValue,
    onSubmit,
    onCancel,
    type,
    itemId
}) => {
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const [value, setValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validations, setValidations] = useState({
        length: false,
        noSpecialChars: false
    });
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadTranslations('forms');
    }, [language, loadTranslations]);

    useEffect(() => {
        setValidations({
            length: value.length >= 3 && value.length <= 50,
            noSpecialChars: /^[a-zA-Z0-9\s-_]+$/.test(value)
        });
    }, [value]);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    const isFormValid = validations.length && validations.noSpecialChars;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const body = type === 'updateChat' 
                ? { chatname: value }
                : { FileName: value };

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/${type === 'updateChat' ? 'chat' : 'file'}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || t('edit.error'));
            }

            onSubmit(value);
        } catch (error) {
            setError(error instanceof Error ? error.message : t('edit.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6 text-xl">
            <div className="relative flex flex-col gap-2">
                <input
                    ref={firstInputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={t('edit.name')}
                    className="w-full px-4 py-3 text-xl
                        bg-white/10 backdrop-blur-sm rounded-xl
                        border border-white/20 text-white
                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                        focus:outline-none placeholder-white/40
                        transition-all duration-300"
                    required
                    disabled={isLoading}
                />
                {error && (
                    <div className="text-red-400 text-sm mt-1">
                        {error}
                    </div>
                )}
                {/* Validadores dinámicos */}
                <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${
                        validations.length ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.length ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>{t('edit.maxLength').replace('{length}', '50')}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                        validations.noSpecialChars ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.noSpecialChars ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>{t('edit.noSpecialChars')}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-white/70 hover:text-white/90 
                        transition-colors rounded-lg"
                    disabled={isLoading}
                >
                    {t('edit.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                        ${!isFormValid || isLoading
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span>{t('common.loading')}</span>
                        </>
                    ) : (
                        t('edit.save')
                    )}
                </button>
            </div>
        </form>
    );
};
