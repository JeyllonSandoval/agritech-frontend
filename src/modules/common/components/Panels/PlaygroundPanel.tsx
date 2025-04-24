import ChatPanel from '@/modules/common/components/Panels/ChatPanel';
import { FileProps } from '@/modules/common/hooks/getFiles';

interface PlaygroundPanelProps {
    isSidebarOpen: boolean;
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    onShowPdf: (file: FileProps) => void;
}

export default function PlaygroundPanel({ isSidebarOpen, activePanel, onPanelChange, onShowPdf }: PlaygroundPanelProps) {
    return (
        <div className={`fixed top-[80px] right-0 bottom-0 transition-all duration-300 ${
            isSidebarOpen ? 'left-[300px]' : 'left-0'
        }`}>
            {activePanel === 'welcome' && (
                <div className="flex items-center justify-center h-full">
                    <h2 className="text-4xl">Welcome</h2>
                </div>
            )}
            {activePanel === 'chat' && <ChatPanel onPanelChange={onPanelChange} />}
        </div>
    );
} 