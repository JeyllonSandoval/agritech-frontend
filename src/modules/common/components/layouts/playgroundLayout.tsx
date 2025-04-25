"use client";
import { useState, useEffect } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import PlaygroundPanel from "@/modules/common/components/Panels/PlaygroundPanel";
import ModalCreated from "@/modules/common/components/modals/modalCreated";
import { FileProps } from '@/modules/common/hooks/getFiles';
import { useModal } from '@/modules/common/context/modalContext';
import { useRouter, usePathname } from 'next/navigation';

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'welcome' | 'files' | 'chat'>('welcome');
    const { openModal, closeModal, setSelectedFile } = useModal();
    const router = useRouter();
    const pathname = usePathname();

    // Sincronizar el panel activo con la ruta actual
    useEffect(() => {
        if (pathname === '/playground/files') {
            setActivePanel('files');
        } else if (pathname === '/playground/chat') {
            setActivePanel('chat');
        } else if (pathname === '/playground') {
            setActivePanel('welcome');
        }
    }, [pathname]);

    const handlePanelChange = (panel: 'welcome' | 'files' | 'chat') => {
        setActivePanel(panel);
        // Solo navegar si no estamos ya en la ruta correcta
        if (panel === 'files' && pathname !== '/playground/files') {
            router.push('/playground/files');
        } else if (panel === 'chat' && pathname !== '/playground/chat') {
            router.push('/playground/chat');
        } else if (panel === 'welcome' && pathname !== '/playground') {
            router.push('/playground');
        }
    };

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={activePanel}
                onPanelChange={handlePanelChange}
                onCreateChat={() => {
                    openModal('createdChat', 'create');
                    setSelectedFile(null);
                }}
            />
            
            <PlaygroundPanel 
                isSidebarOpen={isSidebarOpen}
                activePanel={activePanel}
                onPanelChange={handlePanelChange}
                onShowPdf={(file) => {
                    setSelectedFile(file);
                    openModal('createdFile', 'preview', file.FileName, undefined, undefined, undefined, file.contentURL);
                }}
            />

            <ModalCreated />
        </div>
    );
}


