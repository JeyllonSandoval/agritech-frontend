import { useEffect, useRef } from 'react';

interface ItemMessageProps {
    content: string;
    sendertype: 'user' | 'ai';
    createdAt?: string;
    isNew?: boolean;
    fileInfo?: { FileName?: string };
}

export default function ItemMessage({ content, sendertype, createdAt, isNew, fileInfo }: ItemMessageProps) {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isNew && messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isNew]);

    const isUser = sendertype === 'user';
    const isFileMessage = content === 'New file selected';

    return (
        <div 
            ref={messageRef}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full my-2 z-10`}
        >
            <div className={`max-w-[90vw] sm:max-w-[70vw] md:max-w-[45vw] rounded-2xl p-3 sm:p-4 break-words shadow-md
                ${isUser 
                    ? isFileMessage 
                        ? 'bg-emerald-800/90 text-white border border-emerald-400/60 shadow-lg' 
                        : 'bg-emerald-500/30 text-white' 
                    : 'bg-white/10 text-white/90'
                }
                ${isFileMessage ? 'font-semibold' : ''}
            `}
            >
                {fileInfo && (
                    <div className="mb-2 text-xs sm:text-sm text-emerald-200 truncate max-w-[70vw] md:max-w-[30vw]">
                        File: {fileInfo.FileName}
                    </div>
                )}
                <div className="text-sm sm:text-base whitespace-pre-wrap break-words">
                    {content}
                </div>
                {createdAt && (
                    <div className="mt-2 text-xs text-white/50 text-right">
                        {new Date(createdAt).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
}
