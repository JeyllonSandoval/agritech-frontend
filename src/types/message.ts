export interface Message {
    MessageID?: string;
    ChatID: string;
    FileID?: string;
    sendertype: "user" | "ai";
    contentFile?: string;
    contentAsk?: string;
    contentResponse?: string;
    content?: string;
    question?: string;
    answer?: string;
    createdAt: string;
    status: string;
    isPredefinedQuestion?: boolean;
    isLoading?: boolean;
    questionIndex?: number;
} 