import { useEffect, useRef } from 'react';
import { Message } from '@/types/message';
import ItemMessage from '@/components/common/UI/items/itemMessages';
import FileAnalysisResult from '@/components/common/UI/items/FileAnalysisResult';
import DeviceDataMessage from '@/components/common/UI/items/DeviceDataMessage';
import { FileProps } from '@/hooks/getFiles';
import { useLanguage } from '@/context/languageContext';
import tableTranslations from '@/data/Lenguage/en/table.json';

interface TableShowMessageProps {
    messages: Message[];
    isLoading: boolean;
    files: FileProps[];
}

export default function TableShowMessage({ messages, isLoading, files }: TableShowMessageProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();
    const translations = tableTranslations;

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }
    };

    const scrollToBottomImmediate = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'auto', 
                block: 'end',
                inline: 'nearest'
            });
        }
    };

    useEffect(() => {
        // Scroll inmediato cuando se agregan nuevos mensajes
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 50); // Delay más corto para respuesta más rápida

        return () => clearTimeout(timeoutId);
    }, [messages, isLoading]);

    // Scroll adicional cuando se envía un mensaje específicamente
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sendertype === 'user') {
                // Scroll inmediato para mensajes del usuario
                scrollToBottomImmediate();
            } else if (lastMessage.isLoading) {
                // Scroll suave para respuestas de AI
                const timeoutId = setTimeout(() => {
                    scrollToBottom();
                }, 10);
                
                return () => clearTimeout(timeoutId);
            }
        }
    }, [messages]);

    const getFileName = (fileId: string | undefined) => {
        if (!fileId) return null;
        
        // Si no hay archivos cargados, retornar null para que se muestre el estado de carga
        if (!files || files.length === 0) {
            return null;
        }
        
        const file = files.find(f => f.FileID === fileId);
        return file?.FileName;
    };

    const getMessageContent = (message: Message): string => {
        // Para mensajes de usuario
        if (message.sendertype === 'user') {
            if (message.contentAsk) return message.contentAsk;
            if (message.contentFile) return message.contentFile;
            return '';
        }
        
        // Para mensajes de AI
        if (message.sendertype === 'ai') {
            if (message.contentResponse) return message.contentResponse;
            return '';
        }
        
        return '';
    };

    const isDeviceDataMessage = (message: Message): boolean => {
        // Buscar en todos los campos de contenido posibles
        const content = message.content || message.contentAsk || message.contentFile || message.question || '';
        // Verificar que sea un mensaje de usuario y contenga datos de dispositivo o grupo
        return message.sendertype === 'user' && (
            content.includes('Datos del Dispositivo:') || 
            content.includes('Datos del Grupo:')
        );
    };

    const getDeviceNameFromMessage = (message: Message): string => {
        // Buscar en todos los campos de contenido posibles
        const content = message.content || message.contentAsk || message.contentFile || message.question || '';
        
        // Buscar nombre de dispositivo
        const deviceNameMatch = content.match(/Datos del Dispositivo: (.+?)\n/);
        if (deviceNameMatch) {
            return deviceNameMatch[1].trim();
        }
        
        // Buscar nombre de grupo
        const groupNameMatch = content.match(/Datos del Grupo: (.+?)\n/);
        if (groupNameMatch) {
            return groupNameMatch[1].trim();
        }
        
        return 'Dispositivo';
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
                // Debug logging para todos los mensajes de usuario
                if (message.sendertype === 'user') {
                    const content = message.content || message.contentAsk || message.contentFile || message.question || '';
                    console.log('🔍 [TableShowMessage] Mensaje de usuario:', {
                        messageId: message.MessageID,
                        contentPreview: content.substring(0, 50) + '...',
                        contentAsk: message.contentAsk,
                        content: message.content,
                        contentFile: message.contentFile,
                        question: message.question
                    });
                    
                    if (content.includes('Datos del Dispositivo:')) {
                        console.log('🔍 [TableShowMessage] ¡DETECTADO MENSAJE DE DISPOSITIVO!');
                    }
                    if (content.includes('Datos del Grupo:')) {
                        console.log('🔍 [TableShowMessage] ¡DETECTADO MENSAJE DE GRUPO!');
                    }
                }

                // Mensajes de datos de dispositivo o grupo - DEBE IR PRIMERO para tener prioridad
                if (message.sendertype === 'user' && isDeviceDataMessage(message)) {
                    console.log('🔍 [TableShowMessage] Renderizando mensaje de dispositivo/grupo');
                    return (
                        <div className='w-full flex justify-end items-center'>
                            <div key={`device-${message.MessageID || 'temp'}-${index}`} className="w-full lg:w-1/2">
                                <DeviceDataMessage
                                    deviceName={getDeviceNameFromMessage(message)}
                                    deviceData={message.content || message.contentAsk || message.contentFile || message.question || ''}
                                    timestamp={message.createdAt}
                                />
                            </div>
                        </div>
                    );
                }

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
                                    // Si no hay archivos cargados, mostrar estado de carga
                                    if (!files || files.length === 0) return { FileName: translations.loadingFile };
                                    return { FileName: translations.fileNotFound };
                                })()}
                                isLoading={!files || files.length === 0}
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
                    
                    return (
                        <div key={`analysis-${message.MessageID || 'temp'}-${index}`} className="w-full">
                            <FileAnalysisResult
                                question={message.contentAsk}
                                description=""
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
                                // Si no hay archivos cargados, mostrar estado de carga
                                if (!files || files.length === 0) return { FileName: translations.loadingFile };
                                return { FileName: translations.fileNotFound };
                            })() : undefined}
                            isLoading={message.isLoading || Boolean(message.FileID && (!files || files.length === 0))}
                        />
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
