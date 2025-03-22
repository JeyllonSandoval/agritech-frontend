import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useChatStore } from '@/modules/common/stores/chatStore';

interface TokenPayload {
    UserID: string;
    // ... otros campos del token si existen
}

interface ChatCreatedFormProps {
    onClose: () => void;
}

export default function ChatCreatedForm({ onClose }: ChatCreatedFormProps) {
    const [chatName, setChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const addChat = useChatStore(state => state.addChat);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const decoded = jwtDecode<TokenPayload>(token);
            const UserID = decoded.UserID;

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    UserID: UserID,
                    chatname: chatName
                })
            });

            if (!response.ok) {
                throw new Error('Error creating chat');
            }

            const newChat = await response.json();
            const chatToAdd = {
                ChatID: newChat.ChatID,
                chatname: chatName
            };
            
            addChat(chatToAdd);
            onClose();
        } catch (err) {
            setError('Failed to create chat');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative">
                <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Enter chat name"
                    className="w-full px-4 py-3 text-sm
                        bg-white/10 backdrop-blur-sm rounded-xl
                        border border-white/20 text-white
                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                        focus:outline-none placeholder-white/40
                        transition-all duration-300"
                    required
                />
            </div>
            
            {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                    {error}
                </p>
            )}
            
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm rounded-xl
                        border border-white/20 text-white/70
                        hover:bg-white/10 hover:text-white
                        transition-all duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2.5 text-sm rounded-xl
                        transition-all duration-300
                        ${isLoading 
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Creating...
                        </span>
                    ) : 'Create Chat'}
                </button>
            </div>
        </form>
    );
}
