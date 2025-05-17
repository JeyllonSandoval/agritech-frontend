import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ButtonItemEdit } from '@/components/common/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/context/modalContext';
import { useRouter } from 'next/navigation';

interface ItemsChatsProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', chatId?: string) => void;
    selectedChatId: string | null;
    onChatSelect: (chatId: string, chat: any) => void;
}

export default function ItemsChats({ onPanelChange, selectedChatId, onChatSelect }: ItemsChatsProps) {
    const chats = useChatStore(state => state.chats);
    const setChats = useChatStore(state => state.setChats);
    const { openModal } = useModal();
    const router = useRouter();

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
                                relative overflow-hidden
                                hover:bg-emerald-500/20 hover:border-emerald-400/30
                                ${selectedChatId === chat.ChatID 
                                    ? 'bg-emerald-500/30 border border-emerald-400/40' 
                                    : 'bg-gray-800/20 border border-transparent'}`}
                            onClick={() => {
                                onChatSelect(chat.ChatID, chat);
                                onPanelChange('chat', chat.ChatID);
                                router.push(`/playground/chat/${chat.ChatID}`);
                            }}
                        >
                            <span className="relative z-10 text-white group-hover:translate-x-1 transition-transform duration-300">
                                {chat.chatname || 'Unnamed Chat'}
                            </span>
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
    }, [chats, onPanelChange, selectedChatId, onChatSelect, setChats, router]);

    return (
        <>
            {renderChats()}
        </>
    );
}
