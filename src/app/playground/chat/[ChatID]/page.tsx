'use client';

import PlaygroundLayout from '@/components/features/layouts/playgroundLayout';
import ProtectedRoute from '@/utils/protectedRoute';

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
