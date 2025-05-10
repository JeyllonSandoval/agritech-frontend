import { Message } from '@/types/message';

interface ItemMessageProps extends Pick<Message, 'sendertype' | 'createdAt'> {
    content: string;
    isNew?: boolean;
    fileInfo?: {
        FileName: string;
    };
}

export default function ItemMessage({ content, sendertype, createdAt, isNew, fileInfo }: ItemMessageProps) {
    const formattedDate = new Date(createdAt).toLocaleString();
    const isUser = sendertype === 'user';

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 sm:p-4 ${
                isUser 
                    ? 'bg-green-500/20 text-white' 
                    : 'bg-white/10 text-white'
            } ${isNew ? 'animate-fade-in' : ''}`}>
                {fileInfo && (
                    <div className="mb-2 text-sm text-white/70">
                        File: {fileInfo.FileName}
                    </div>
                )}
                <p className="text-sm sm:text-base">{content}</p>
                <div className="mt-2 text-xs text-white/50">
                    {formattedDate}
                </div>
            </div>
        </div>
    );
}
