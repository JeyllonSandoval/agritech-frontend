"use client";
import { useState } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import PlaygroundPanel from "@/modules/common/components/Panels/PlaygroundPanel";
import ModalCreated from "@/modules/common/components/modals/modalCreated";
import { FileProps } from '@/modules/common/hooks/getFiles';
import { useModal } from '@/modules/common/context/modalContext';

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'welcome' | 'files' | 'chat'>('welcome');
    const { openModal, closeModal, setSelectedFile } = useModal();

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                onCreateChat={() => {
                    openModal('createdChat', 'create');
                    setSelectedFile(null);
                }}
            />
            
            <PlaygroundPanel 
                isSidebarOpen={isSidebarOpen}
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                onShowPdf={(file) => {
                    setSelectedFile(file);
                    openModal('createdFile', 'preview', file.FileName, undefined, undefined, undefined, file.contentURL);
                }}
            />

            <ModalCreated />
        </div>
    );
}


