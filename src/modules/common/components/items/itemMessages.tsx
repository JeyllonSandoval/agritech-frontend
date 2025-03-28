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

    const processContent = (content: string, sendertype: 'user' | 'ai') => {
        if (sendertype === 'user') {
            // Siempre buscamos "ASK USER:" y solo mostramos lo que sigue
            const askIndex = content.indexOf('ASK USER:');
            if (askIndex !== -1) {
                return content.substring(askIndex + 'ASK USER:'.length).trim();
            }
            // Si no encuentra "ASK USER:", muestra el contenido original
            return content;
        }
        return content;
    };

    const displayContent = processContent(content, sendertype);

    return (
        <div 
            ref={messageRef}
            className={`flex ${sendertype === 'user' ? 'justify-end' : 'justify-start'} mb-4
                animate-fadeIn`}
        >
            <div className={`max-w-[70%] rounded-xl p-4 ${
                sendertype === 'user' 
                    ? 'bg-gradient-to-r from-emerald-800/80 to-emerald-700/80 text-white' 
                    : 'bg-gradient-to-r from-gray-700/30 to-gray-500/30 text-white'
            } ${isNew ? 'animate-slideIn' : ''}`}>
                {fileInfo && sendertype === 'user' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Nuevo archivo seleccionado: {fileInfo.FileName}</span>
                    </div>
                )}
                <p className="whitespace-pre-wrap text-sm break-words">
                    {displayContent}
                </p>
                {createdAt && (
                    <span className="text-xs opacity-60 mt-2 block">
                        {new Date(createdAt).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}
