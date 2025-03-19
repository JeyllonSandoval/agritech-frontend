import FileCreatedForm from "../forms/fileCreatedForm";

interface ModalCreatedProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalCreated({ isOpen, onClose }: ModalCreatedProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-950 p-6 rounded-lg relative w-1/2 h-1/2 flex flex-col items-center justify-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-4xl font-bold text-gray-700">Create New File</h1>
                    <button
                        onClick={onClose}
                        className="text-4xl text-gray-500 hover:text-red-600"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <FileCreatedForm onClose={onClose} />
                </div>
            </div>
        </div>
    );
}


