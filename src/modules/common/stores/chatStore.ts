import { create } from 'zustand';

interface Chat {
    ChatID: string;
    chatname: string;
}

interface ChatStore {
    chats: Chat[];
    currentChat: Chat | null;
    addChat: (chat: Chat) => void;
    setChats: (chats: Chat[]) => void;
    setCurrentChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    currentChat: null,
    addChat: (chat) => set((state) => ({
        chats: [...state.chats, {
            ChatID: chat.ChatID,
            chatname: chat.chatname
        }]
    })),
    setChats: (chats) => set({ 
        chats: chats.map(chat => ({
            ChatID: chat.ChatID,
            chatname: chat.chatname
        }))
    }),
    setCurrentChat: (chat) => set({ currentChat: chat })
})); 