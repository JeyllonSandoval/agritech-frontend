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
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white/10 text-white/90'
            }`}>
                <p className="whitespace-pre-wrap text-sm">{content}</p>
                {createdAt && (
                    <span className="text-xs opacity-50 mt-2 block">
                        {new Date(createdAt).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}
