import { create } from 'zustand';

interface Chat {
    ChatID: string;
    chatname: string;
}

interface ChatStore {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    currentChat: Chat | null;
    setCurrentChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    setChats: (chats) => set({ chats }),
    addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
    currentChat: null,
    setCurrentChat: (chat) => set({ currentChat: chat }),
}));
