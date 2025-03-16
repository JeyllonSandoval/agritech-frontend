import { useState } from 'react';
import FilesPanels from '../Panels/FilesPanels';

interface PlaygroundPanelProps {
    isSidebarOpen: boolean;
    activePanel: 'welcome' | 'files' | 'chat';
}

export default function PlaygroundPanel({ isSidebarOpen, activePanel }: PlaygroundPanelProps) {
    return (
        <div className={`flex-grow transition-all duration-300 ${
            isSidebarOpen ? 'ml-[300px]' : 'ml-0'
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