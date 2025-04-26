import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { getChats } from "@/modules/common/hooks/getChats";
import { useChatStore } from '@/modules/common/stores/chatStore';
import ButtonFile from '../UI/buttons/buttonFile';
import ButtonCreatedChat from '../UI/buttons/buttonCreatedChat';
import ItemsChats from '../UI/items/itemsChats';
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface NavbarLateralProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', chatId?: string) => void;
    onCreateChat: () => void;
}

export default function NavbarLateral({ isOpen, onToggle, activePanel, ...props }: NavbarLateralProps) {
    const navRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const setChats = useChatStore(state => state.setChats);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Reset selected chat when panel changes
    useEffect(() => {
        if (activePanel !== 'chat') {
            setSelectedChatId(null);
            setCurrentChat(null);
        }
    }, [activePanel, setCurrentChat]);

    // Set selected chat from URL
    useEffect(() => {
        if (pathname.startsWith('/playground/chat/')) {
            const chatId = pathname.split('/').pop();
            if (chatId) {
                setSelectedChatId(chatId);
            }
        }
    }, [pathname]);

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

    const handlePanelChange = useCallback((panel: 'welcome' | 'files' | 'chat', chatId?: string) => {
        props.onPanelChange(panel, chatId);
    }, [props.onPanelChange]);

    const handleChatSelect = useCallback((chatId: string, chat: any) => {
        setSelectedChatId(chatId);
        setCurrentChat(chat);
    }, [setCurrentChat]);

    return (
        <>
            {/* Toggle Menu Button */}
            <button
                ref={buttonRef}
                onClick={onToggle}
                className={`fixed left-4 top-1/4 z-[9] h-1/2
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

                <div className="flex flex-col h-[calc(100%-4rem)] p-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/playground/files">
                            <ButtonFile onClick={() => handlePanelChange('files')} />
                        </Link>
                        <ButtonCreatedChat onClick={props.onCreateChat} />
                    </div>
                    <div className="flex flex-col gap-3 mt-4 flex-1 min-h-0">
                        <h2 className="text-lg font-medium text-gray-400 px-2">Recent Chats</h2>
                        <div className="flex-1 overflow-y-auto pr-2
                            scrollbar scrollbar-w-1.5 
                            scrollbar-track-white/5
                            scrollbar-thumb-emerald-400/50 
                            hover:scrollbar-thumb-emerald-400/70
                            scrollbar-track-rounded-full
                            scrollbar-thumb-rounded-full">
                            <ItemsChats 
                                onPanelChange={handlePanelChange}
                                selectedChatId={selectedChatId}
                                onChatSelect={handleChatSelect}
                            />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
