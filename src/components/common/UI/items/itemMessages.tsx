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
            <div
                className={`max-w-[90vw] sm:max-w-[70vw] lg:max-w-[60vw] rounded-2xl p-3 sm:p-4 break-words shadow-md
                ${isFileMessage
                    ? 'bg-emerald-900/80 text-white flex flex-col gap-1'
                    : isUser
                        ? 'bg-emerald-500/30 text-white'
                        : 'bg-white/10 text-white/90'}
                `}
            >
                {isFileMessage && (
                    <span className="flex items-center gap-2 mb-1">
                        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium">New file selected</span>
                    </span>
                )}
                {isFileMessage && fileInfo && (
                    <div className="text-xs sm:text-sm text-emerald-200 truncate max-w-[80vw] lg:max-w-[70vw]">
                        {fileInfo.FileName}
                    </div>
                )}
                {!isFileMessage && (
                    <>
                        {fileInfo && (
                            <div className="mb-2 text-xs sm:text-sm text-emerald-200 truncate max-w-[70vw] md:max-w-[30vw]">
                                File: {fileInfo.FileName}
                            </div>
                        )}
                        <div className="text-base sm:text-lg whitespace-pre-wrap break-words">
                            {content}
                        </div>
                    </>
                )}
                {createdAt && (
                    <div className="mt-2 text-xs text-white/50 text-right">
                        {new Date(createdAt).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
}
