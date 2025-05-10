export interface Message {
    MessageID: string;
    ChatID: string;
    FileID?: string;
    sendertype: "user" | "ai";
    contentFile?: string;
    contentAsk?: string;
    contentResponse?: string;
    createdAt: string;
    status: string;
} 