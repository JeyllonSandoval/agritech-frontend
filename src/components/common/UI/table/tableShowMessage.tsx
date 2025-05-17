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

    // Mantener un registro de los FileIDs que ya han mostrado su mensaje inicial
    const shownFileIds = new Set<string>();
    const processedFileIds = new Set<string>();

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 sm:p-3 space-y-2 sm:space-y-3 md:p-4 scrollbar z-0">
            {messages.map((message, index) => {
                // Mostrar mensaje de archivo solo la primera vez que aparece ese FileID
                if (message.FileID && message.contentFile && !shownFileIds.has(message.FileID)) {
                    shownFileIds.add(message.FileID);
                    return (
                        <div key={`filemsg-${message.MessageID || 'temp'}-${index}`} className="w-full">
                            <ItemMessage
                                content={message.contentFile}
                                sendertype={'user'}
                                createdAt={message.createdAt}
                                isNew={false}
                                fileInfo={(() => {
                                    const name = getFileName(message.FileID);
                                    if (name) return { FileName: name };
                                    if (files.length === 0) return { FileName: 'Loading file...' };
                                    return { FileName: 'File not found' };
                                })()}
                                isLoading={message.isLoading}
                            />
                        </div>
                    );
                }

                // Mostrar FileAnalysisResult para respuestas de análisis
                if (message.FileID && message.contentAsk && message.contentResponse && !processedFileIds.has(message.MessageID || '')) {
                    processedFileIds.add(message.MessageID || '');
                    const questionIndex = message.questionIndex || 0;
                    const question = predefinedQuestions.questions[questionIndex]?.question || message.contentAsk;
                    
                    return (
                        <div key={`analysis-${message.MessageID || 'temp'}-${index}`} className="w-full">
                            <FileAnalysisResult
                                question={question}
                                description={predefinedQuestions.questions[questionIndex]?.description || ''}
                                answer={message.contentResponse}
                                isLoading={message.isLoading || isLoading}
                            />
                        </div>
                    );
                }

                // Mensajes normales
                return (
                    <div key={`message-${message.MessageID || 'temp'}-${index}`} className="w-full">
                        <ItemMessage
                            content={getMessageContent(message)}
                            sendertype={message.sendertype}
                            createdAt={message.createdAt}
                            isNew={false}
                            fileInfo={message.FileID ? (() => {
                                const name = getFileName(message.FileID);
                                if (name) return { FileName: name };
                                if (files.length === 0) return { FileName: 'Loading file...' };
                                return { FileName: 'File not found' };
                            })() : undefined}
                            isLoading={message.isLoading}
                        />
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
