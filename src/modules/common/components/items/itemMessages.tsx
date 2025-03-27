interface ItemMessageProps {
    content: string;
    sendertype: 'user' | 'ai';
    createdAt?: string;
}

export default function ItemMessage({ content, sendertype, createdAt }: ItemMessageProps) {
    return (
        <div className={`flex ${sendertype === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] rounded-xl p-4 ${
                sendertype === 'user' 
                    ? 'bg-gradient-to-r from-emerald-800/80 to-emerald-700/80 text-white' 
                    : 'bg-gradient-to-r from-gray-700/30 to-gray-500/30 text-white'
            }`}>
                <p className="whitespace-pre-wrap text-sm break-words">{content}</p>
                {createdAt && (
                    <span className="text-xs opacity-60 mt-2 block">
                        {new Date(createdAt).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}
