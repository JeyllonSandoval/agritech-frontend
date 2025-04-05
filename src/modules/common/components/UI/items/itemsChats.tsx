import { useCallback } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import { ButtonItemEdit } from '@/modules/common/components/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/modules/common/context/modalContext';

interface ItemsChatsProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    selectedChatId: string | null;
    onChatSelect: (chatId: string, chat: any) => void;
}

export default function ItemsChats({ onPanelChange, selectedChatId, onChatSelect }: ItemsChatsProps) {
    const chats = useChatStore(state => state.chats);
    const setChats = useChatStore(state => state.setChats);
    const { openModal } = useModal();

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error deleting chat');

            // Remover el chat del store
            setChats(chats.filter(chat => chat.ChatID !== chatId));
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const renderChats = useCallback(() => {
        if (chats.length === 0) {
            return (
                <div key="empty-chats-container" className="space-y-2 flex flex-col gap-2 text-2xl">
                    <p key="empty-chats-message" className="text-gray-400/70 text-xl text-center mt-32">Empty chats</p>
                </div>
            );
        }

        return (
            <div key="chats-list" className="space-y-2 flex flex-col text-2xl">
                {chats.map((chat) => (
                    <div 
                        key={chat.ChatID}
                        className="relative group"
                    >
                        <button 
                            className={`w-full px-4 py-3 backdrop-blur-sm text-white/90 rounded-lg 
                                shadow-lg shadow-black/20 transition-all duration-300
                                flex items-center justify-between gap-2 text-sm font-medium
                                relative overflow-hidden ${selectedChatId === chat.ChatID ? 'bg-green-500/20' : ''}`}
                            onClick={() => {
                                onChatSelect(chat.ChatID, chat);
                                onPanelChange('chat');
                            }}
                        >
                            <div className={`absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-800/60 to-transparent
                                transform transition-transform duration-500 ease-in-out
                                ${selectedChatId === chat.ChatID ? 'translate-y-[70%]' : 'translate-y-full group-hover:translate-y-0'}`}>
                            </div>
                            <span className="relative z-10 text-white">{chat.chatname || 'Unnamed Chat'}</span>
                        </button>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
    }, [chats, onPanelChange, selectedChatId, onChatSelect, setChats]);

    return (
        <>
            {renderChats()}
        </>
    );
}
