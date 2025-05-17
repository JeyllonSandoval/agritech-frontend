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
    isLoading?: boolean;
}

export default function ItemMessage({ content, contentAsk, contentResponse, contentFile, sendertype, createdAt, isNew, fileInfo, isLoading }: ItemMessageProps) {
    const formattedDate = createdAt ? new Date(createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) : '';
    const isUser = sendertype === 'user';

    const displayContent =
        content ??
        contentAsk ??
        contentResponse ??
        contentFile ??
        '';

    // Estilos compactos para loading
    const loadingBubbleClass = "bg-white/5 border border-white/20 rounded-lg px-2 py-1 flex items-center space-x-1 min-h-0 min-w-0 shadow-none";
    const normalBubbleClass = `max-w-[80%] rounded-lg p-3 sm:p-4 ${
        isUser 
            ? 'bg-emerald-800/60 text-white' 
            : 'bg-white/5 backdrop-blur-sm border border-white/20 text-white/90'
    } ${isNew ? 'animate-fade-in' : ''}`;

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={isLoading ? loadingBubbleClass : normalBubbleClass}>
                {fileInfo && !isLoading && (
                    <div className="mb-2 text-sm text-white/70">
                        File: {fileInfo.FileName}
                    </div>
                )}
                {isLoading ? (
                    <div className="flex items-center space-x-1 text-sm lg:text-base p-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
                    </div>
                ) : (
                    displayContent && (
                        <p className="text-sm sm:text-base">{displayContent}</p>
                    )
                )}
                {!isLoading && (
                    <div className="mt-2 text-xs text-white/50">
                        {formattedDate}
                    </div>
                )}
            </div>
        </div>
    );
}
