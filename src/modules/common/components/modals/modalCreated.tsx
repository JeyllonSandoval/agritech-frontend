import TableShowFile from "@/modules/common/components/UI/table/tableShowFile";
import TablePdfView from "@/modules/common/components/UI/table/tablePdfView";
import FileCreatedForm from "@/modules/common/components/forms/fileCreatedForm";
import ChatCreatedForm from "@/modules/common/components/forms/chatCreatedForm";
import { FileProps } from '@/modules/common/hooks/getFiles';

interface ModalCreatedProps {
    isOpen: boolean;
    onClose: (type: 'file' | 'chat') => void;
    type: 'file' | 'chat';
    mode?: 'upload' | 'select' | 'preview';
    selectedFile?: FileProps;
    onFileSelect?: (file: FileProps) => void;
}

export default function ModalCreated({ 
    isOpen, 
    onClose, 
    type, 
    mode = 'upload', 
    selectedFile,
    onFileSelect 
}: ModalCreatedProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => onClose(type)}
        >
            <div 
                className="bg-gray-100/10 backdrop-blur-sm rounded-2xl 
                    border border-white/20 shadow-lg
                    p-8 relative w-full max-w-4xl
                    flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between items-center mb-6 sticky">
                    <h1 className="text-2xl font-semibold text-white truncate max-w-[80%]">
                        {type === 'file' ? (
                            mode === 'upload' 
                                ? 'Upload File' 
                                : mode === 'preview'
                                    ? selectedFile?.FileName || 'PREVIEW FILE'
                                    : 'Your Files'
                        ) : 'Create New Chat'}
                    </h1>
                    <button
                        onClick={() => onClose(type)}
                        className="text-white/70 text-4xl hover:text-red-400 
                            transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <div className="w-full">
                    {type === 'file' && mode === 'select' && (
                        <TableShowFile 
                            onSelect={(file) => {
                                onFileSelect?.(file);
                                onClose(type);
                            }} 
                        />
                    )}
                    {type === 'file' && mode === 'preview' && selectedFile && (
                        <TablePdfView file={selectedFile} />
                    )}
                    {type === 'file' && mode === 'upload' && <FileCreatedForm onClose={() => onClose(type)} />}
                    {type === 'chat' && <ChatCreatedForm onClose={() => onClose(type)} />}
                </div>
            </div>
        </div>
    );
}


