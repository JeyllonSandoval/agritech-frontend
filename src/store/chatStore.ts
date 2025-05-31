import { create } from 'zustand';

interface Chat {
    ChatID: string;
    chatname: string;
}

interface ChatStore {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    removeChat: (chatId: string) => void;
    clearChats: () => void;
    currentChat: Chat | null;
    setCurrentChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    setChats: (chats) => set({ chats }),
    addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
    removeChat: (chatId) => set((state) => ({ 
        chats: state.chats.filter(chat => chat.ChatID !== chatId),
        currentChat: state.currentChat?.ChatID === chatId ? null : state.currentChat
    })),
    clearChats: () => set({ chats: [], currentChat: null }),
    currentChat: null,
    setCurrentChat: (chat) => set({ currentChat: chat }),
}));
