export interface Message {
    ChatID: string;
    FileID?: string;
    sendertype: "user" | "ai";
    contentFile?: string;
    contentAsk?: string;
    contentResponse?: string;
    createdAt: string;
    status: string;
    isPredefinedQuestion?: boolean;
    isLoading?: boolean;
    questionIndex?: number;
} 