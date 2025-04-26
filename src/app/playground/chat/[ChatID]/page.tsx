'use client';

import PlaygroundLayout from '@/modules/common/components/layouts/playgroundLayout';
import ProtectedRoute from '@/modules/common/utils/protectedRoute';

interface ChatPageProps {
    params: {
        ChatID: string;
    };
}

export default function ChatPage({ params }: ChatPageProps) {
    return (
        <ProtectedRoute>
            <PlaygroundLayout />
        </ProtectedRoute>
    );
}
