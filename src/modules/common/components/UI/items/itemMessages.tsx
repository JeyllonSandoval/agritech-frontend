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

    const getDisplayContent = (content: string) => {
        if (content.includes('ASK USER:')) {
            return content.split('ASK USER:')[1].trim();
        }
        return content;
    };

    return (
        <div 
            ref={messageRef}
            className={`flex ${sendertype === 'user' ? 'justify-end' : 'justify-start'} mb-4
                animate-fadeIn`}
        >
            <div className={`max-w-[70%] rounded-xl p-4 ${
                sendertype === 'user' 
                    ? fileInfo 
                        ? 'bg-gradient-to-r from-emerald-500/40 to-emerald-600/70 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30' 
                        : 'bg-gradient-to-r from-emerald-800/80 to-emerald-700/80 text-white' 
                    : 'bg-gradient-to-r from-gray-700/30 to-gray-500/30 text-white'
            } ${isNew ? 'animate-slideIn' : ''}`}>
                {fileInfo && sendertype === 'user' && (
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <div className="p-2 bg-emerald-400/20 rounded-lg">
                            <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-emerald-200">New file selected</span>
                            <span className="text-emerald-300 text-xs opacity-90">{fileInfo.FileName}</span>
                        </div>
                    </div>
                )}
                {!fileInfo && (
                    <>
                        <p className="whitespace-pre-wrap text-sm break-words">
                            {getDisplayContent(content)}
                        </p>
                        {createdAt && (
                            <span className="text-xs opacity-60 mt-2 block">
                                {new Date(createdAt).toLocaleTimeString()}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
