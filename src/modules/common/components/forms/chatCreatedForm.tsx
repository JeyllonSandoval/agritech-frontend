import { useState } from 'react';

interface ChatCreatedFormProps {
    onClose: () => void;
}

export default function ChatCreatedForm({ onClose }: ChatCreatedFormProps) {
    const [chatName, setChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: chatName })
            });

            if (!response.ok) {
                throw new Error('Error creating chat');
            }

            onClose();
        } catch (err) {
            setError('Failed to create chat');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-4xl">
            <div>
                <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Enter chat name"
                    className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
                    required
                />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating...' : 'Create Chat'}
                </button>
            </div>
        </form>
    );
}
