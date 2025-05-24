import { useEffect, useRef } from 'react';
import { Message } from '@/types/message';
import ItemMessage from '@/components/common/UI/items/itemMessages';
import FileAnalysisResult from '@/components/common/UI/items/FileAnalysisResult';
import { FileProps } from '@/hooks/getFiles';
import predefinedQuestions from '@/data/Lenguage/en/predefinedQuestions.json';

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

    // Nuevo Set para evitar duplicados de mensajes de usuario por FileID
    //
    // Para evitar duplicados, primero identificamos los FileID que tienen mensajes de usuario o análisis
    const fileIdsWithUserOrAnalysis = new Set<string>();
    messages.forEach((msg) => {
        if (
            msg.FileID &&
            (msg.sendertype === 'user' || (msg.contentAsk && msg.contentResponse))
        ) {
            fileIdsWithUserOrAnalysis.add(msg.FileID);
        }
    });
    //
    // Set para evitar renderizar más de un análisis por MessageID
    const processedFileAnalysisIds = new Set<string>();
    // Set para evitar renderizar más de un mensaje de archivo por FileID
    const renderedFileMsgIds = new Set<string>();
    // Guardar el último FileID de mensaje de usuario para evitar duplicados consecutivos
    let lastUserFileID: string | null = null;

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 sm:p-3 space-y-2 sm:space-y-3 md:p-4 scrollbar z-0">
            {messages.map((message, index) => {
                // Mostrar mensaje de archivo solo si NO hay mensajes de usuario o análisis para ese FileID
                if (
                    message.FileID &&
                    message.contentFile &&
                    !fileIdsWithUserOrAnalysis.has(message.FileID) &&
                    !renderedFileMsgIds.has(message.FileID)
                ) {
                    renderedFileMsgIds.add(message.FileID);
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

                // Mostrar FileAnalysisResult para respuestas de análisis (solo una vez por MessageID)
                if (
                    message.FileID &&
                    message.contentAsk &&
                    message.contentResponse &&
                    !processedFileAnalysisIds.has(message.MessageID || '')
                ) {
                    processedFileAnalysisIds.add(message.MessageID || '');
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

                // Mostrar mensajes de usuario, pero nunca dos seguidos con el mismo FileID
                if (message.FileID && message.sendertype === 'user') {
                    if (lastUserFileID === message.FileID) {
                        return null;
                    }
                    lastUserFileID = message.FileID;
                } else if (message.sendertype === 'user') {
                    lastUserFileID = null;
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
