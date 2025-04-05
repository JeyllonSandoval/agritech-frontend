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
    const { isOpen, type, mode, initialValue, onEdit, onFileSelect, selectedFile, closeModal, itemId } = useModal();

    if (!isOpen) return null;

    const getTitle = () => {
        if (mode === 'edit') {
            return type === 'updateFile' ? 'Edit File Name' : 'Edit Chat Name';
        }
        if (type === 'createdFile' && mode === 'preview' && selectedFile) {
            return selectedFile.FileName;
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
                                if (onFileSelect) {
                                    onFileSelect(file);
                                    closeModal();
                                }
                            }} 
                        />
                    )}
                    {type === 'createdFile' && mode === 'preview' && selectedFile && (
                        <div className="w-full h-[70vh] bg-white/5 rounded-lg overflow-hidden">
                            <iframe
                                src={selectedFile.contentURL}
                                className="w-full h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/30"
                                title={selectedFile.FileName}
                            />
                        </div>
                    )}
                    {type === 'createdFile' && mode === 'create' && <FileCreatedForm onClose={() => closeModal()} />}
                    {type === 'createdChat' && mode === 'create' && <ChatCreatedForm onClose={() => closeModal()} />}
                    {mode === 'edit' && (
                        <EditForm
                            initialValue={initialValue}
                            onSubmit={(value) => {
                                console.log('ModalCreated - Edit submission:', {
                                    type,
                                    itemId,
                                    value
                                });
                                onEdit?.(value);
                                closeModal();
                            }}
                            onCancel={() => closeModal()}
                            type={type === 'updateFile' ? 'updateFile' : 'updateChat'}
                            itemId={itemId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


