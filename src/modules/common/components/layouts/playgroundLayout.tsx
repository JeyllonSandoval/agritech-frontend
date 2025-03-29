"use client";
import { useState } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import PlaygroundPanel from "@/modules/common/components/Panels/PlaygroundPanel";
import ModalCreated from "@/modules/common/components/modals/modalCreated";

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'welcome' | 'files' | 'chat'>('welcome');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                onCreateChat={() => setIsModalOpen(true)}
            />
            
            <PlaygroundPanel 
                isSidebarOpen={isSidebarOpen}
                activePanel={activePanel}
                onPanelChange={(panel) => {
                    // Add your panel change handling logic here
                    // For example:
                    setActivePanel(panel);
                }}
            />

            <ModalCreated 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="chat"
            />
        </div>
    );
}


