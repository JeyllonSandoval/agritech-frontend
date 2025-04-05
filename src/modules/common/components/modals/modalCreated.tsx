import TableShowFile from "@/modules/common/components/UI/table/tableShowFile";
import TablePdfView from "@/modules/common/components/UI/table/tablePdfView";
import FileCreatedForm from "@/modules/common/components/forms/fileCreatedForm";
import ChatCreatedForm from "@/modules/common/components/forms/chatCreatedForm";
import { EditForm } from "@/modules/common/components/forms/editForm";
import { FileProps } from '@/modules/common/hooks/getFiles';
import { useModal } from '@/modules/common/context/modalContext';

type ModalType = 'createdChat' | 'createdFile' | 'updateChat' | 'updateFile';
type ModalMode = 'create' | 'select' | 'preview' | 'edit';

export default function ModalCreated() {
    const { isOpen, type, mode, initialValue, onEdit, onFileSelect, selectedFile, closeModal } = useModal();

    if (!isOpen) return null;

    const getTitle = () => {
        if (mode === 'edit') {
            return type === 'updateFile' ? 'Edit File Name' : 'Edit Chat Name';
        }
        switch (type) {
            case 'createdChat':
                return 'Create New Chat';
            case 'createdFile':
                return 'Upload New File';
            case 'updateChat':
                return 'Update Chat Name';
            case 'updateFile':
                return 'Update File Name';
            default:
                return '';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => closeModal()}
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
                        {getTitle()}
                    </h1>
                    <button
                        onClick={() => closeModal()}
                        className="text-white/70 text-4xl hover:text-red-400 
                            transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>
                <div className="w-full">
                    {type === 'createdFile' && mode === 'select' && (
                        <TableShowFile 
                            onSelect={(file) => {
                                onFileSelect?.(file);
                                closeModal();
                            }} 
                        />
                    )}
                    {type === 'createdFile' && mode === 'preview' && selectedFile && (
                        <TablePdfView file={selectedFile} />
                    )}
                    {type === 'createdFile' && mode === 'create' && <FileCreatedForm onClose={() => closeModal()} />}
                    {type === 'createdChat' && mode === 'create' && <ChatCreatedForm onClose={() => closeModal()} />}
                    {mode === 'edit' && (
                        <EditForm
                            initialValue={initialValue}
                            onSubmit={(value) => {
                                onEdit?.(value);
                                closeModal();
                            }}
                            onCancel={() => closeModal()}
                            title={getTitle()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


