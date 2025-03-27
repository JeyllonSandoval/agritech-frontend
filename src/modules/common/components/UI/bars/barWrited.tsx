import { useState, FormEvent } from 'react';

interface BarWritedProps {
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
}

export default function BarWrited({ onSendMessage, isLoading = false }: BarWritedProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full p-4 border-t border-white/10">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    disabled={isLoading}
                    className="w-full text-sm px-4 py-3 bg-white/5 rounded-xl
                        text-white placeholder-white/50
                        border border-white/10 focus:border-emerald-500/50
                        outline-none transition-all duration-300"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="absolute right-2 p-2 rounded-lg
                        text-white/70 hover:text-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300"
                >
                    {isLoading ? (
                        <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
}
