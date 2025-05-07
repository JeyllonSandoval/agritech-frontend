"use client";
import { useState } from "react";
import NavbarLateral from "@/components/features/layouts/navbarLateral";
import ModalCreated from "@/components/features/modals/modalCreated";
import { useModal } from '@/context/modalContext';
import { useRouter, usePathname } from 'next/navigation';
import ChatPanel from '../Panels/ChatPanel';
import FilesPanels from '../Panels/FilesPanels';
import { FileProps } from "@/hooks/getFiles";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { openModal, closeModal, setSelectedFile } = useModal();
    const router = useRouter();
    const pathname = usePathname();

    const handlePanelChange = (panel: 'welcome' | 'files' | 'chat', chatId?: string) => {
        if (panel === 'files' && pathname !== '/playground/files') {
            router.push('/playground/files');
        } else if (panel === 'chat') {
            if (chatId) {
                router.push(`/playground/chat/${chatId}`);
            } else {
                router.push('/playground/chat');
            }
        } else if (panel === 'welcome' && pathname !== '/playground') {
            router.push('/playground');
        }
    };

    const isChatRoute = pathname.startsWith('/playground/chat');
    const chatId = isChatRoute ? pathname.split('/').pop() : null;

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={pathname === '/playground/files' ? 'files' : isChatRoute ? 'chat' : 'welcome'}
                onPanelChange={handlePanelChange}
                onCreateChat={() => {
                    openModal('createdChat', 'create');
                    setSelectedFile(null);
                }}
            />
            
            <div className={`fixed top-[80px] right-0 bottom-0 transition-all duration-300 ${
                isSidebarOpen ? 'left-[300px]' : 'left-0'
            }`}>

            </div>

            <div className="flex-1">
                {children}
            </div>

            <ModalCreated />
        </div>
    );
}


