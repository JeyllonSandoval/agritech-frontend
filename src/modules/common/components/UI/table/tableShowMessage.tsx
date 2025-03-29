import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/modules/common/types/chat';
import ItemMessage from '@/modules/common/components/items/itemMessages';
import FileAnalysisResult from '@/modules/common/components/items/FileAnalysisResult';
import { FileProps } from '@/modules/common/hooks/getFiles';

interface TableShowMessageProps {
    messages: ChatMessage[];
    isLoading: boolean;
    files: FileProps[];
}

export default function TableShowMessage({ messages, isLoading, files }: TableShowMessageProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const getFileName = (fileId: string | null) => {
        if (!fileId || !files) return null;
        const file = files.find(f => f.FileID === fileId);
        return file?.FileName;
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar">
            {messages.map((message, index) => (
                <div key={message.MessageID}>
                    {message.question && message.description ? (
                        <FileAnalysisResult
                            question={message.question}
                            description={message.description}
                            answer={message.content}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ItemMessage
                            content={message.content}
                            sendertype={message.sendertype}
                            createdAt={message.createdAt}
                            isNew={index === messages.length - 1}
                            fileInfo={message.FileID ? { 
                                FileName: getFileName(message.FileID) || 'File not found'
                            } : undefined}
                        />
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
                <div className="flex justify-start mb-4 animate-fadeIn">
                    <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                </div>
            )}
        </div>
    );
}
