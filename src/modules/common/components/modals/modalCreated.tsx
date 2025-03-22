import FileCreatedForm from "@/modules/common/components/forms/fileCreatedForm";
import ChatCreatedForm from "@/modules/common/components/forms/chatCreatedForm";

interface ModalCreatedProps {
    isOpen: boolean;
    onClose: (type: 'file' | 'chat') => void;
    type: 'file' | 'chat';
}

export default function ModalCreated({ isOpen, onClose, type }: ModalCreatedProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => onClose(type)}
        >
            <div 
                className="bg-gray-100/10 backdrop-blur-sm rounded-2xl 
                    border border-white/20 shadow-lg
                    p-8 relative w-1/2 h-1/2 
                    flex flex-col items-center justify-center gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-2xl font-semibold text-white">
                        Create New {type === 'file' ? 'File' : 'Chat'}
                    </h1>
                    <button
                        onClick={() => onClose(type)}
                        className="text-white/70 text-4xl hover:text-red-400 
                            transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    {type === 'file' && <FileCreatedForm onClose={() => onClose(type)} />}
                    {type === 'chat' && <ChatCreatedForm onClose={() => onClose(type)} />}
                </div>
            </div>
        </div>
    );
}


