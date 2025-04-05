import { useCallback } from 'react';
import { useChatStore } from '@/modules/common/stores/chatStore';
import { ButtonItemEdit } from '@/modules/common/components/UI/CompleButtons/ButtonItemEdit';

interface ItemsChatsProps {
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    selectedChatId: string | null;
    onChatSelect: (chatId: string, chat: any) => void;
}

export default function ItemsChats({ onPanelChange, selectedChatId, onChatSelect }: ItemsChatsProps) {
    const chats = useChatStore(state => state.chats);

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
                                onEdit={() => {
                                    // Add your edit chat logic here
                                    console.log('Edit chat:', chat.ChatID);
                                }}
                                onRemove={() => {
                                    // Add your remove chat logic here
                                    console.log('Remove chat:', chat.ChatID);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }, [chats, onPanelChange, selectedChatId, onChatSelect]);

    return renderChats();
}
