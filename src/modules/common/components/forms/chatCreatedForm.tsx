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
        <form onSubmit={handleSubmit} className="w-1/2 h-full ">
            <div className="relative">
                <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Enter chat name"
                    className="w-full px-4 py-3 text-lg bg-gray-800/50 text-white border-2 border-gray-700 rounded-lg
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none
                    transition-all duration-300 backdrop-blur-sm"
                    required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            
            {error && (
                <p className="text-red-400 text-sm font-medium px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                    {error}
                </p>
            )}
            
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium rounded-lg border-2 border-gray-600 text-gray-300
                    hover:bg-gray-700/50 hover:border-gray-500 hover:text-white
                    transition-all duration-300 backdrop-blur-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500
                    text-white hover:from-emerald-500 hover:to-emerald-400
                    disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
                    transition-all duration-300 shadow-lg shadow-emerald-500/20"
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
