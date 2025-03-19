import { useState } from 'react';
import FilesPanels from '../Panels/FilesPanels';

interface PlaygroundPanelProps {
    isSidebarOpen: boolean;
    activePanel: 'welcome' | 'files' | 'chat';
}

export default function PlaygroundPanel({ isSidebarOpen, activePanel }: PlaygroundPanelProps) {
    return (
        <div className={`fixed top-[80px] right-0 bottom-0 transition-all duration-300 ${
            isSidebarOpen ? 'left-[300px]' : 'left-0'
        }`}>
            {activePanel === 'welcome' && (
                <div className="flex items-center justify-center h-full bg-gray-500">
                    <h2 className="text-4xl">Welcome</h2>
                </div>
            )}
            {activePanel === 'files' && <FilesPanels />}
        </div>
    );
} 