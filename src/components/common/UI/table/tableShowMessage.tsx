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
        if (typeof message.contentAsk === 'string' && message.contentAsk.trim() !== '') return message.contentAsk;
        if (typeof message.contentFile === 'string' && message.contentFile.trim() !== '') return message.contentFile;
        if (typeof message.contentResponse === 'string' && message.contentResponse.trim() !== '') return message.contentResponse;
        return '';
    };

    return (
        <div className="flex-1 overflow-y-auto p-1 sm:p-3 space-y-2 sm:space-y-3 md:p-4 scrollbar z-0">
            {messages.map((message, index) => (
                <div key={message.sendertype + '-' + (message.FileID || '')} className="w-full">
                    {message.FileID && message.contentAsk && message.contentResponse ? (
                        <FileAnalysisResult
                            key={message.sendertype + '-' + (message.FileID || '') + '-analysis'}
                            question={predefinedQuestions.questions[message.questionIndex || 0]?.question || ''}
                            description={predefinedQuestions.questions[message.questionIndex || 0]?.description || ''}
                            answer={message.contentResponse}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ItemMessage
                            key={message.sendertype + '-' + (message.FileID || '') + '-single'}
                            content={getMessageContent(message)}
                            contentAsk={message.contentAsk}
                            contentResponse={message.contentResponse}
                            contentFile={message.contentFile}
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
                    <div className="bg-white/10 rounded-xl p-2 sm:p-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                </div>
            )}
        </div>
    );
}
