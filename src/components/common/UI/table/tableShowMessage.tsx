import { useEffect, useRef } from 'react';
import { Message } from '@/types/message';
import ItemMessage from '@/components/common/UI/items/itemMessages';
import FileAnalysisResult from '@/components/common/UI/items/FileAnalysisResult';
import { FileProps } from '@/hooks/getFiles';
import predefinedQuestions from '@/data/predefinedQuestions.json';

interface TableShowMessageProps {
    messages: Message[];
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

    const getFileName = (fileId: string | undefined) => {
        if (!fileId || !files) return null;
        const file = files.find(f => f.FileID === fileId);
        return file?.FileName;
    };

    const getMessageContent = (message: Message): string => {
        if (message.sendertype === 'user' && message.contentAsk) return message.contentAsk;
        if (message.sendertype === 'ai' && message.contentResponse) return message.contentResponse;
        if (message.contentFile) return message.contentFile;
        return '';
    };

    return (
        <div className="flex-1 overflow-y-auto p-1 sm:p-3 space-y-2 sm:space-y-3 md:p-4 scrollbar z-0">
            {messages.map((message, index) => (
                <div key={`${message.MessageID || 'temp'}-${index}`} className="w-full">
                    {message.FileID && message.contentAsk && message.contentResponse ? (
                        <FileAnalysisResult
                            key={`analysis-${message.MessageID || 'temp'}-${index}`}
                            question={predefinedQuestions.questions[message.questionIndex || 0]?.question || ''}
                            description={predefinedQuestions.questions[message.questionIndex || 0]?.description || ''}
                            answer={message.contentResponse}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ItemMessage
                            key={`message-${message.MessageID || 'temp'}-${index}`}
                            content={getMessageContent(message)}
                            sendertype={message.sendertype}
                            createdAt={message.createdAt}
                            isNew={index === messages.length - 1}
                            fileInfo={message.FileID ? { 
                                FileName: getFileName(message.FileID) || 'File not found'
                            } : undefined}
                            isLoading={message.isLoading}
                        />
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
