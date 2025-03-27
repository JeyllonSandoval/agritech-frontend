import { ChatMessage } from '@/modules/common/types/chat';
import ItemMessage from '@/modules/common/components/items/itemMessages';

interface TableShowMessageProps {
    messages: ChatMessage[];
    isLoading?: boolean;
}

export default function TableShowMessage({ messages, isLoading }: TableShowMessageProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
                <ItemMessage
                    key={message.MessageID || index}
                    content={message.content}
                    sendertype={message.sendertype}
                    createdAt={message.createdAt}
                />
            ))}
            
            {isLoading && (
                <div className="flex justify-start mb-4">
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
