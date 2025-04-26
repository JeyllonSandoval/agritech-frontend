"use client";
import { useState } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import ModalCreated from "@/modules/common/components/modals/modalCreated";
import { useModal } from '@/modules/common/context/modalContext';
import { useRouter, usePathname } from 'next/navigation';
import ChatPanel from '@/modules/common/components/Panels/ChatPanel';
import FilesPanels from '@/modules/common/components/Panels/FilesPanels';
import { FileProps } from "@/modules/common/hooks/getFiles";

export default function PlaygroundLayout() {
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
                {pathname === '/playground/files' && (
                    <FilesPanels 
                        onShowPdf={(file: FileProps) => {
                            setSelectedFile(file);
                            openModal('createdFile', 'preview', file.FileName, undefined, undefined, undefined, file.contentURL);
                        }}
                    />
                )}
                {isChatRoute && (
                    <ChatPanel 
                        onPanelChange={handlePanelChange}
                        chatId={chatId}
                    />
                )}
                {pathname === '/playground' && (
                    <div className="flex items-center justify-center h-full">
                        <h2 className="text-4xl">Welcome</h2>
                    </div>
                )}
            </div>

            <ModalCreated />
        </div>
    );
}


