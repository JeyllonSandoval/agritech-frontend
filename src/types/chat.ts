export interface ChatMessage {
    MessageID: string;
    ChatID: string;
    FileID: string | null;
    sendertype: 'user' | 'ai';
    content: string;
    createdAt: string;
    status: 'active' | 'inactive';
    question?: string;
    description?: string;
    isLoading?: boolean;
}

export interface AnalysisRequest {
    ChatID: string;
    FileID: string;
    content: string;
    sendertype: 'user';
} 