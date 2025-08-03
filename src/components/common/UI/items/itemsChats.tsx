import { useCallback, useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ButtonItemEdit } from '@/components/common/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/context/modalContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

interface ItemsChatsProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', chatId?: string) => void;
    selectedChatId: string | null;
    onChatSelect: (chatId: string, chat: any) => void;
    collapsed?: boolean;
}

export default function ItemsChats({ onPanelChange, selectedChatId, onChatSelect, collapsed = false }: ItemsChatsProps) {
    const chats = useChatStore(state => state.chats);
    const setChats = useChatStore(state => state.setChats);
    const { openModal } = useModal();
    const router = useRouter();
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('items').then(() => setIsLoaded(true));
    }, [language]);

    const handleEditChat = async (chatId: string, newName: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chatname: newName })
            });

            if (!response.ok) throw new Error('Error updating chat');

            // Actualizar el chat en el store
            setChats(chats.map(chat => 
                chat.ChatID === chatId 
                    ? { ...chat, chatname: newName }
                    : chat
            ));
        } catch (error) {
            console.error('Error updating chat:', error);
        }
    };

    const handleRemoveChat = async (chatId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            console.log('handleRemoveChat - Chat data:', {
                ChatID: chatId,
                token: token.substring(0, 10) + '...' // Solo mostramos parte del token por seguridad
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('handleRemoveChat - Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                let errorMessage = 'Error deleting chat';
                try {
                    const errorData = await response.json();
                    console.error('handleRemoveChat - Error details:', {
                        status: response.status,
                        statusText: response.statusText,
                        errorData
                    });
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error('handleRemoveChat - Error parsing response:', e);
                }
                throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
            }

            // Actualizar el chat localmente
            setChats(chats.filter(chat => chat.ChatID !== chatId));
            console.log('handleRemoveChat - Successfully deleted chat:', chatId);
            if (selectedChatId === chatId) {
                router.push('/playground');
            }
        } catch (error) {
            console.error('handleRemoveChat - Error:', error);
            // Aquí podríamos mostrar una notificación al usuario
            alert('Error deleting chat');
        }
    };

    const renderChats = useCallback(() => {
        if (chats.length === 0) {
            return (
                <div key="empty-chats-container" className="space-y-2 flex flex-col gap-2 text-2xl">
                    <p key="empty-chats-message" className="text-gray-400/70 text-xl text-center mt-32">{t('noChats')}</p>
                </div>
            );
        }

        if (collapsed) {
            return (
                <div key="chats-list-collapsed" className="flex flex-col gap-2 p-2 h-full overflow-y-auto
                    scrollbar scrollbar-w-1.5 
                    scrollbar-track-gray-800/20
                    scrollbar-thumb-emerald-500/50 
                    hover:scrollbar-thumb-emerald-400/70
                    scrollbar-track-rounded-full
                    scrollbar-thumb-rounded-full">
                    {chats.map((chat, index) => (
                        <div 
                            key={chat.ChatID}
                            className="relative group flex-shrink-0"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <button 
                                className={`w-16 h-12 backdrop-blur-sm text-gray-300 rounded-xl 
                                    shadow-lg shadow-black/10 transition-all duration-300 ease-out
                                    flex items-center justify-center
                                    relative overflow-hidden
                                    hover:bg-emerald-500/20 hover:text-emerald-300
                                    transform hover:scale-105 active:scale-95
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                                    ${selectedChatId === chat.ChatID 
                                        ? 'bg-emerald-400/30 border border-emerald-500/50 shadow-emerald-500/20' 
                                        : 'bg-gray-800/50 border border-gray-700/30 hover:border-emerald-500/40'}`}
                                onClick={() => {
                                    onChatSelect(chat.ChatID, chat);
                                    onPanelChange('chat', chat.ChatID);
                                    router.push(`/playground/chat/${chat.ChatID}`);
                                }}
                                title={chat.chatname || 'Unnamed Chat'}
                            >
                                <svg className="w-5 h-5 transition-all duration-300 ease-out
                                    group-hover:scale-110 group-hover:rotate-3" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div key="chats-list" className="flex flex-col gap-2 p-2 h-full overflow-y-auto
                scrollbar scrollbar-w-1.5 
                scrollbar-track-gray-800/20
                scrollbar-thumb-emerald-500/50 
                hover:scrollbar-thumb-emerald-400/70
                scrollbar-track-rounded-full
                scrollbar-thumb-rounded-full">
                {chats.map((chat, index) => (
                    <div 
                        key={chat.ChatID}
                        className="relative group flex-shrink-0"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <button 
                            className={`w-full px-4 py-3 backdrop-blur-sm text-white rounded-lg 
                                shadow-lg shadow-black/10 transition-all duration-300 ease-out
                                flex items-center justify-between gap-2 text-sm font-medium
                                relative overflow-hidden
                                hover:bg-emerald-500/20 hover:text-emerald-300
                                transform hover:scale-[1.02] active:scale-[0.98]
                                focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                                ${selectedChatId === chat.ChatID 
                                    ? 'bg-emerald-400/30 border border-emerald-500/50 shadow-emerald-500/20' 
                                    : 'bg-gray-800/50 border border-gray-700/30 hover:border-emerald-500/40'}`}
                            onClick={() => {
                                onChatSelect(chat.ChatID, chat);
                                onPanelChange('chat', chat.ChatID);
                                router.push(`/playground/chat/${chat.ChatID}`);
                            }}
                        >
                            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 ease-out">
                                {chat.chatname || 'Unnamed Chat'}
                            </span>
                        </button>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                            <ButtonItemEdit 
                                initialValue={chat.chatname}
                                onEdit={(newName) => handleEditChat(chat.ChatID, newName)}
                                onRemove={() => handleRemoveChat(chat.ChatID)}
                                type="updateChat"
                                itemId={chat.ChatID}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }, [chats, onPanelChange, selectedChatId, onChatSelect, setChats, router, t, collapsed]);

    if (!isLoaded) return null;

    return (
        <>{renderChats()}</>
    );
}
