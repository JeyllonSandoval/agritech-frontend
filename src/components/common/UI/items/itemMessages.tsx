import { Message } from '@/types/message';

interface ItemMessageProps extends Pick<Message, 'sendertype' | 'createdAt'> {
    content?: string;
    contentAsk?: string;
    contentResponse?: string;
    contentFile?: string;
    isNew?: boolean;
    fileInfo?: {
        FileName: string;
    };
}

export default function ItemMessage({ content, contentAsk, contentResponse, contentFile, sendertype, createdAt, isNew, fileInfo }: ItemMessageProps) {
    const formattedDate = createdAt ? new Date(createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) : '';
    const isUser = sendertype === 'user';

    // Determine which content to show
    let displayContent = '';
    if (sendertype === 'user') {
        displayContent = contentAsk || content || '';
    } else if (sendertype === 'ai') {
        displayContent = contentResponse || content || '';
    } else {
        displayContent = contentFile || content || '';
    }

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 sm:p-4 ${
                isUser 
                    ? 'bg-emerald-800/60 text-white' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/20 text-white/90'
            } ${isNew ? 'animate-fade-in' : ''}`}>
                {fileInfo && (
                    <div className="mb-2 text-sm text-white/70">
                        File: {fileInfo.FileName}
                    </div>
                )}
                {displayContent && (
                    <p className="text-sm sm:text-base">{displayContent}</p>
                )}
                <div className="mt-2 text-xs text-white/50">
                    {formattedDate}
                </div>
            </div>
        </div>
    );
}
