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
    const formattedDate = new Date(createdAt).toLocaleString();
    const isUser = sendertype === 'user';

    // Determine which content to show
    let displayContent = '';
    if (sendertype === 'ai' && typeof contentResponse === 'string' && contentResponse.trim() !== '') {
        displayContent = contentResponse;
    } else if (sendertype === 'user' && typeof contentAsk === 'string' && contentAsk.trim() !== '') {
        displayContent = contentAsk;
    } else if (typeof contentFile === 'string' && contentFile.trim() !== '') {
        displayContent = contentFile;
    } else if (typeof content === 'string' && content.trim() !== '') {
        displayContent = content;
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
                {displayContent ? (
                    <p className="text-sm sm:text-base">{displayContent}</p>
                ) : null}
                <div className="mt-2 text-xs text-white/50">
                    {formattedDate}
                </div>
            </div>
        </div>
    );
}
