"use client";
import { useState } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import PlaygroundPanel from "@/modules/common/components/Panels/PlaygroundPanel";
import ModalCreated from "@/modules/common/components/modals/modalCreated";
import { FileProps } from '@/modules/common/hooks/getFiles';

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'welcome' | 'files' | 'chat'>('welcome');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileProps | undefined>(undefined);

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                onCreateChat={() => {
                    setIsModalOpen(true);
                    setSelectedFile(undefined);
                }}
            />
            
            <PlaygroundPanel 
                isSidebarOpen={isSidebarOpen}
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                onShowPdf={(file) => {
                    setSelectedFile(file);
                    setIsModalOpen(true);
                }}
            />

            <ModalCreated 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFile(undefined);
                }}
                type={selectedFile ? 'createdFile' : 'createdChat'}
                mode={selectedFile ? 'preview' : undefined}
                selectedFile={selectedFile}
            />
        </div>
    );
}


