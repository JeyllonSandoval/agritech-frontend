import { useEffect, useRef } from 'react';

interface ItemMessageProps {
    content: string;
    sendertype: 'user' | 'ai';
    createdAt?: string;
    isNew?: boolean;
}

export default function ItemMessage({ content, sendertype, createdAt, isNew }: ItemMessageProps) {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isNew && messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isNew]);

    const processContent = (content: string, sendertype: 'user' | 'ai') => {
        if (sendertype === 'user') {
            const askIndex = content.indexOf('ASK USER:');
            if (askIndex !== -1) {
                return content.substring(askIndex + 'ASK USER:'.length).trim();
            }
            // Si no encuentra "ASK USER:", busca "Primera pregunta:"
            const primeraIndex = content.indexOf('Primera pregunta:');
            if (primeraIndex !== -1) {
                return content.substring(primeraIndex + 'Primera pregunta:'.length).trim();
            }
            return content; // Si no encuentra ninguno, devuelve el contenido original
        }
        return content; // Para mensajes AI, devuelve el contenido completo
    };

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
                <p className="whitespace-pre-wrap text-sm break-words">
                    {processContent(content, sendertype)}
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
