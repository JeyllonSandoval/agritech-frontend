import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/modules/common/types/chat';
import ItemMessage from '@/modules/common/components/items/itemMessages';
import FileAnalysisResult from '@/modules/common/components/items/FileAnalysisResult';
import { FileProps } from '@/modules/common/hooks/getFiles';

interface TableShowMessageProps {
    messages: ChatMessage[];
    isLoading?: boolean;
    files?: FileProps[];
    analysisResults?: {
        questionId: string;
        question: string;
        description: string;
        answer: string;
        isLoading: boolean;
    }[];
}

export default function TableShowMessage({ messages, isLoading, files, analysisResults }: TableShowMessageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prevMessagesLength = useRef(messages.length);

    useEffect(() => {
        prevMessagesLength.current = messages.length;
    }, [messages]);

    const getFileName = (fileId: string | null) => {
        if (!fileId || !files) return null;
        const file = files.find(f => f.FileID === fileId);
        return file?.FileName;
    };

    // Filtrar mensajes que no son de análisis
    const regularMessages = messages.filter(message => !message.FileID || !analysisResults?.some(result => 
        result.answer === message.content
    ));

    return (
        <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 scrollbar"
        >
            {regularMessages.map((message, index) => (
                <ItemMessage
                    key={message.MessageID || index}
                    content={message.content}
                    sendertype={message.sendertype}
                    createdAt={message.createdAt}
                    isNew={index === regularMessages.length - 1}
                    fileInfo={message.FileID ? { 
                        FileName: getFileName(message.FileID) || 'Archivo no encontrado'
                    } : undefined}
                />
            ))}
            
            {analysisResults && analysisResults.length > 0 && (
                <div className="mt-4 space-y-4">
                    {analysisResults.map((result) => (
                        <FileAnalysisResult
                            key={result.questionId}
                            question={result.question}
                            description={result.description}
                            answer={result.answer}
                            isLoading={result.isLoading}
                        />
                    ))}
                </div>
            )}
            
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
