"use client";
import { useState } from "react";
import NavbarLateral from "@/modules/common/components/layouts/navbarLateral";
import PlaygroundPanel from "@/modules/common/components/Panels/PlaygroundPanel";

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePanel, setActivePanel] = useState<'welcome' | 'files' | 'chat'>('welcome');

    return (
        <div className="w-full h-full flex">
            <div className="w-full h-full flex bg-gray-100 relative overflow-hidden">
                <NavbarLateral 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    setActivePanel={setActivePanel}
                />
                <PlaygroundPanel 
                    isSidebarOpen={isSidebarOpen}
                    activePanel={activePanel}
                />
            </div>
        </div>
    );
}

