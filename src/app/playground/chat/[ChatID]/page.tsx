'use client';

import ProtectedRoute from '@/utils/protectedRoute';
import { use } from 'react';
import ChatPanel from '@/components/features/Panels/ChatPanel';
import { useRouter } from 'next/navigation';

interface ChatPageProps {
    params: Promise<{
        ChatID: string;
    }>;
}

export default function ChatPage({ params }: ChatPageProps) {
    const { ChatID } = use(params);
    const router = useRouter();
    
    const handlePanelChange = (panel: 'welcome' | 'files' | 'chat', chatId?: string) => {
        if (panel === 'files') {
            router.push('/playground/files');
        } else if (panel === 'welcome') {
            router.push('/playground');
        }
    };
    
    return (
        <ProtectedRoute>
            <ChatPanel onPanelChange={handlePanelChange} ChatID={ChatID} />
        </ProtectedRoute>
    );
}
