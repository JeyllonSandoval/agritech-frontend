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
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => onClose(type)}
        >
            <div 
                className="bg-gray-950 p-6 rounded-lg relative w-1/2 h-1/2 flex flex-col items-center justify-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-4xl font-bold text-gray-500">Create New {type === 'file' ? 'File' : 'Chat'}</h1>
                    <button
                        onClick={() => onClose(type)}
                        className="text-4xl text-gray-500 hover:text-red-600"
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


