'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useChatStore } from '@/store/chatStore';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfile } from '@/hooks/useProfile';

interface TokenPayload {
    UserID: string;
}

interface ChatCreatedFormProps {
    onClose: () => void;
}

export default function ChatCreatedForm({ onClose }: ChatCreatedFormProps) {
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const { userData, countryName } = useProfile();
    const [chatName, setChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validations, setValidations] = useState({
        length: false,
        noSpecialChars: false
    });
    const addChat = useChatStore(state => state.addChat);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isFormValid = validations.length && validations.noSpecialChars;

    useEffect(() => {
        loadTranslations('forms');
    }, [language, loadTranslations]);

    useEffect(() => {
        setValidations({
            length: chatName.length >= 3 && chatName.length <= 50,
            noSpecialChars: /^[a-zA-Z0-9\s-_]+$/.test(chatName)
        });
    }, [chatName]);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const decoded = jwtDecode<TokenPayload>(token);
            const UserID = decoded.UserID;

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    UserID: UserID,
                    chatname: chatName
                })
            });

            if (!response.ok) {
                throw new Error(t('chatCreated.error'));
            }

            const responseData = await response.json();
            if (!responseData.newChat || !Array.isArray(responseData.newChat) || responseData.newChat.length === 0) {
                throw new Error(t('chatCreated.error'));
            }

            const newChat = responseData.newChat[0];
            if (!newChat.ChatID) {
                throw new Error(t('chatCreated.error'));
            }

            const chatToAdd = {
                ChatID: newChat.ChatID,
                chatname: chatName
            };
            addChat(chatToAdd);
            setCurrentChat(chatToAdd);
            // Redirigir automáticamente al nuevo chat
            router.push(`/playground/chat/${chatToAdd.ChatID}`);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('chatCreated.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative flex flex-col gap-2">
                <input
                    ref={firstInputRef}
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder={t('chatCreated.name')}
                    className="w-full px-4 py-3 text-sm
                        bg-white/10 backdrop-blur-sm rounded-xl
                        border border-white/20 text-white
                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                        focus:outline-none placeholder-white/40
                        transition-all duration-300"
                    required
                />
                {/* Validadores dinámicos */}
                <div className="text-xs space-y-1 px-2">
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
                        <span>{t('chatCreated.maxLength').replace('{length}', '50')}</span>
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
                        <span>{t('chatCreated.noSpecialChars')}</span>
                    </div>
                </div>
            </div>
            {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                    {error}
                </p>
            )}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm rounded-xl
                        border border-white/20 text-white/70
                        hover:bg-white/10 hover:text-white
                        transition-all duration-300"
                >
                    {t('chatCreated.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className={`px-6 py-2.5 text-sm rounded-xl
                        transition-all duration-300
                        ${isLoading || !isFormValid
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {isLoading ? t('common.loading') : t('chatCreated.create')}
                </button>
            </div>
        </form>
    );
}
