import { useEffect, useState, useCallback, useRef } from "react";
import { getChats } from "@/modules/common/services/getChats";
import { useChatStore } from '@/modules/common/stores/chatStore';
import ButtonFile from '../UI/buttons/buttonFile';
import ButtonCreatedChat from '../UI/buttons/buttonCreatedChat';

interface NavbarLateralProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    onCreateChat: () => void;
}

export default function NavbarLateral({ isOpen, onToggle, activePanel, ...props }: NavbarLateralProps) {
    const navRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const chats = useChatStore(state => state.chats);
    const setChats = useChatStore(state => state.setChats);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    // Reset selected chat when panel changes
    useEffect(() => {
        if (activePanel !== 'chat') {
            setSelectedChatId(null);
            setCurrentChat(null);
        }
    }, [activePanel, setCurrentChat]);

    const loadChats = useCallback(async () => {
        const userChats = await getChats();
        setChats(userChats);
    }, [setChats]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;

            if (
                navRef.current && 
                !navRef.current.contains(event.target as Node) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target as Node)
            ) {
                onToggle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onToggle]);

    const handlePanelChange = useCallback((panel: 'welcome' | 'files' | 'chat') => {
        props.onPanelChange(panel);
    }, [props.onPanelChange]);

    const renderChats = useCallback(() => {
        console.log('Rendering chats:', chats);
        if (chats.length === 0) {
            return <p key="empty-chats" className="text-gray-400/70 text-sm">Empty chats</p>;
        }

        return chats.map((chat) => (
            <button 
                key={chat.ChatID}
                className={`w-full px-4 py-3 backdrop-blur-sm text-white/90 rounded-lg 
                    shadow-lg shadow-black/20 transition-all duration-300
                    flex items-center justify-center gap-2 text-sm font-medium
                    relative overflow-hidden group ${selectedChatId === chat.ChatID ? 'bg-green-500/20' : ''}`}
                onClick={() => {
                    setSelectedChatId(chat.ChatID);
                    setCurrentChat(chat);
                    handlePanelChange('chat');
                }}
            >
                <div className={`absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-800/60 to-transparent
                    transform transition-transform duration-500 ease-in-out
                    ${selectedChatId === chat.ChatID ? 'translate-y-[70%]' : 'translate-y-full group-hover:translate-y-0'}`}>
                </div>
                <span className="relative z-10 text-white">{chat.chatname || 'Unnamed Chat'}</span>
            </button>
        ));
    }, [chats, handlePanelChange, setCurrentChat, selectedChatId]);

    return (
        <>
            {/* Toggle Menu Button */}
            <button
                ref={buttonRef}
                onClick={onToggle}
                className={`fixed left-4 top-1/4 z-50 h-1/2
                    bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-md
                    border border-white/10 rounded-xl shadow-lg shadow-black/10
                    transition-all duration-300 p-3
                    flex items-center justify-center
                    ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <svg className="w-6 h-6 text-white/70 hover:text-white transition-colors" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Sidebar Navigation */}
            <nav
                ref={navRef}
                className={`fixed left-4 top-[100px] bottom-4 w-[300px] 
                    bg-gray-500/10 backdrop-blur-xl
                    border border-white/10 rounded-2xl shadow-lg shadow-black/10
                    transition-all duration-500 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+20px)]'}`}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h1 className="text-xl font-medium text-white/90">Quick Access</h1>
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                    >
                        <svg className="w-6 h-6 text-white/70 hover:text-white transition-colors" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <ButtonFile onClick={() => handlePanelChange('files')} />
                    <ButtonCreatedChat onClick={props.onCreateChat} />
                    <div key="chats-section" className="flex flex-col gap-3 mt-2">
                        <h2 className="text-sm font-medium text-gray-400 px-2">Recent Chats</h2>
                        <div className="space-y-2 flex flex-col gap-2 text-2xl">
                            {renderChats()}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
