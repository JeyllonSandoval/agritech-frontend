import { useEffect, useState, useCallback } from "react";
import { getChats } from "@/modules/common/services/getChats";
import type { GetChatsProps } from "@/modules/common/services/getChats";
import { useChatStore } from '@/modules/common/stores/chatStore';

interface NavbarLateralProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    onCreateChat: () => void;
}

export default function NavbarLateral({ isOpen, onToggle, ...props }: NavbarLateralProps) {
    const chats = useChatStore(state => state.chats);
    const setChats = useChatStore(state => state.setChats);

    const loadChats = useCallback(async () => {
        const userChats = await getChats();
        setChats(userChats);
    }, [setChats]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

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
                className="w-full px-4 py-3 backdrop-blur-sm text-white/90 rounded-lg 
                    shadow-lg shadow-black/20 transition-all duration-300
                    flex items-center justify-center gap-2 text-sm font-medium
                    relative overflow-hidden group aria-selected:bg-green-500/20"
                role="tab"
                aria-selected="false"
                onClick={(e) => {
                    e.currentTarget.parentElement?.querySelectorAll('button').forEach(btn => {
                        btn.setAttribute('aria-selected', 'false');
                    });

                    e.currentTarget.setAttribute('aria-selected', 'true');
                }}
            >
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-green-800/60 to-transparent
                    transform translate-y-full transition-transform duration-500 ease-in-out
                    group-hover:translate-y-0 group-aria-selected:translate-y-[70%]">
                </div>
                <span className="relative z-10 text-white">{chat.chatname || 'Unnamed Chat'}</span>
            </button>
        ));
    }, [chats]);

    return (
        <>
            {/* Toggle Menu Button */}
            <button
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
            <nav className={`fixed left-4 top-[100px] bottom-4 w-[300px] 
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
                    <button 
                        key="files-button"
                        onClick={() => handlePanelChange('files')}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500
                            hover:from-blue-500 hover:to-blue-400 text-white rounded-lg
                            shadow-lg shadow-blue-500/20 transition-all duration-300
                            flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        File PDF
                    </button>
                    <button 
                        key="create-chat-button"
                        onClick={props.onCreateChat}
                        className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500
                            hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg
                            shadow-lg shadow-emerald-500/20 transition-all duration-300
                            flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Chat
                    </button>
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
