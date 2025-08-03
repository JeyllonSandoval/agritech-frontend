import { useEffect, useState, useCallback, useRef, useContext } from "react";
import Link from "next/link";
import { getChats } from "@/hooks/getChats";
import { useChatStore } from '@/store/chatStore';
import ButtonFile from '@/components/common/UI/buttons/buttonFile';
import ButtonCreatedChat from '@/components/common/UI/buttons/buttonCreatedChat';
import ItemsChats from '@/components/common/UI/items/itemsChats';
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavbarLateralContext } from "@/context/navbarLateralContext";
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface NavbarLateralProps {
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat', chatId?: string) => void;
    onCreateChat: () => void;
}

export default function NavbarLateral({ activePanel, ...props }: NavbarLateralProps) {
    const navRef = useRef<HTMLElement>(null);
    const setChats = useChatStore(state => state.setChats);
    const setCurrentChat = useChatStore(state => state.setCurrentChat);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { isLateralOpen, isCollapsed, onLateralToggle, onCollapseToggle } = useContext(NavbarLateralContext);
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();

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
        loadTranslations('navbar');
    }, [language]);

    const handlePanelChange = useCallback((panel: 'welcome' | 'files' | 'chat', chatId?: string) => {
        props.onPanelChange(panel, chatId);
    }, [props.onPanelChange]);

    const handleChatSelect = useCallback((chatId: string, chat: any) => {
        setSelectedChatId(chatId);
        setCurrentChat(chat);
    }, [setCurrentChat]);

    return (
        <>
            {/* Barra lateral con animaciones mejoradas */}
            <nav
                ref={navRef}
                className={`fixed left-4 top-[84px] bottom-2 z-[50]
                    backdrop-blur-sm
                    border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/30
                    panel-transition
                    transform-gpu will-change-transform
                    ${isLateralOpen 
                        ? isCollapsed 
                            ? 'w-24 translate-x-0 scale-100' 
                            : 'w-[300px] translate-x-0 scale-100' 
                        : 'w-24 translate-x-0 scale-100'
                    }
                    hover:shadow-emerald-500/10 hover:border-emerald-500/30
                    transition-shadow duration-500`}
            >
                {/* Header con botón de expandir/colapsar mejorado */}
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center
                    transition-all duration-500 ease-out">
                    <div className={`transition-all duration-500 ease-out overflow-hidden
                        ${!isCollapsed && isLateralOpen 
                            ? 'opacity-100 max-w-[200px] translate-x-0' 
                            : 'opacity-0 max-w-0 translate-x-4'
                        }`}>
                        <h1 className="text-xl font-bold text-white whitespace-nowrap">
                            {t('navbarLateral.quickAccess')}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onLateralToggle}
                            className="group p-2.5 rounded-xl 
                                hover:bg-emerald-500/20
                                transition-all duration-300 ease-out
                                active:scale-95
                                shadow-lg hover:shadow-emerald-500/20"
                            title={isLateralOpen 
                                ? (isCollapsed ? t('navbarLateral.expand') : t('navbarLateral.collapse'))
                                : t('navbarLateral.expand')
                            }
                        >
                            <svg className={`w-5 h-5 text-white group-hover:text-emerald-400 
                                transition-all duration-300 ease-out transform
                                ${isLateralOpen && !isCollapsed ? 'rotate-180' : 'rotate-0'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M13 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contenido del navbar con animaciones mejoradas */}
                <div className={`p-2 flex flex-col h-[calc(100%-80px)] 
                    content-transition
                    ${(isCollapsed || !isLateralOpen) ? 'items-center' : ''}`}>
                    
                    {/* Botones principales con animaciones suaves */}
                    <div className={`flex flex-col gap-1 content-transition
                        ${(isCollapsed || !isLateralOpen) ? 'items-center' : ''}`}>
                        
                        <div className={`transition-all duration-700 ease-out text-lg
                            ${(isCollapsed || !isLateralOpen) 
                                ? 'opacity-100 max-w-[64px] translate-x-0' 
                                : 'opacity-100 max-w-full translate-x-0'
                            }`}>
                            <Link href="/playground/files">
                                <ButtonFile onClick={() => handlePanelChange('files')} 
                                    collapsed={isCollapsed || !isLateralOpen} />
                            </Link>
                        </div>
                        
                        <div className={`transition-all duration-700 ease-out text-lg
                            ${(isCollapsed || !isLateralOpen) 
                                ? 'opacity-100 max-w-[64px] translate-x-0' 
                                : 'opacity-100 max-w-full translate-x-0'
                            }`}>
                            <ButtonCreatedChat onClick={props.onCreateChat} 
                                collapsed={isCollapsed || !isLateralOpen} />
                        </div>
                    </div>
                    
                    {/* Sección de chats expandida con animación suave */}
                    <div className={`fade-transition overflow-hidden
                        ${isLateralOpen && !isCollapsed 
                            ? 'opacity-100 max-h-[calc(100%-140px)] mt-6' 
                            : 'opacity-0 max-h-0 mt-0'
                        }`}>
                        <div className="flex flex-col gap-3 h-full">
                            <h2 className="text-lg font-medium text-white px-2 
                                fade-transition">
                                {t('navbarLateral.recentChats')}
                            </h2>
                            <div className="flex-1 min-h-0 overflow-y-auto pr-2
                                scrollbar scrollbar-w-1.5 
                                scrollbar-track-gray-800/20
                                scrollbar-thumb-emerald-500/50 
                                hover:scrollbar-thumb-emerald-400/70
                                scrollbar-track-rounded-full
                                scrollbar-thumb-rounded-full
                                content-transition">
                                <ItemsChats 
                                    onPanelChange={handlePanelChange}
                                    selectedChatId={selectedChatId}
                                    onChatSelect={handleChatSelect}
                                    collapsed={false}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Sección de chats colapsada con animación suave */}
                    <div className={`fade-transition overflow-hidden ease-out
                        ${(isCollapsed || !isLateralOpen)
                            ? 'opacity-100 max-h-[calc(100%-140px)] mt-6' 
                            : 'opacity-0 max-h-0 mt-0'
                        }`}>
                        <div className="flex flex-col gap-4 h-full">
                            <div className="flex-1 min-h-0 overflow-y-auto pr-1
                                scrollbar scrollbar-w-1.5 
                                scrollbar-track-gray-800/20
                                scrollbar-thumb-emerald-500/50 
                                hover:scrollbar-thumb-emerald-400/70
                                scrollbar-track-rounded-full
                                scrollbar-thumb-rounded-full
                                content-transition">
                                <ItemsChats 
                                    onPanelChange={handlePanelChange}
                                    selectedChatId={selectedChatId}
                                    onChatSelect={handleChatSelect}
                                    collapsed={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
