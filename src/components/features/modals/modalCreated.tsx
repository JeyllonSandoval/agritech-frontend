'use client';

import TableShowFile from "@/components/common/UI/table/tableShowFile";
import TablePdfView from "@/components/common/UI/table/tablePdfView";
import FileCreatedForm from "@/components/features/forms/fileCreatedForm";
import ChatCreatedForm from "@/components/features/forms/chatCreatedForm";
import { EditForm } from "@/components/features/forms/editForm";
import ConfirmModal from "@/components/features/modals/confirmModal";
import { FileProps } from '@/hooks/getFiles';
import { useModal } from '@/context/modalContext';
import SettingPanel from '../Panels/SettingPanel';
import EditProfileForm from '../forms/editProfileForm';

type ModalType = 'createdChat' | 'createdFile' | 'updateChat' | 'updateFile' | 'settings' | 'edit-profile';
type ModalMode = 'create' | 'select' | 'preview' | 'edit';

export default function ModalCreated() {
    const { 
        isOpen, 
        type, 
        mode, 
        initialValue, 
        onEdit, 
        onFileSelect, 
        selectedFile, 
        closeModal, 
        itemId,
        isConfirmOpen,
        confirmMessage,
        onConfirm,
        closeConfirmModal,
        contentURL
    } = useModal();

    if (!isOpen && !isConfirmOpen) return null;

    const getTitle = () => {
        if (mode === 'edit') {
            if (type === 'edit-profile') return 'Edit Profile';
            return type === 'updateFile' ? 'Edit File Name' : 'Edit Chat Name';
        }
        if (type === 'createdFile' && mode === 'preview' && itemId) {
            return initialValue;
        }
        switch (type) {
            case 'createdChat':
                return 'Create New Chat';
            case 'createdFile':
                return mode === 'preview' ? initialValue : 'Upload New File';
            case 'updateChat':
                return 'Update Chat Name';
            case 'updateFile':
                return 'Update File Name';
            case 'settings':
                return 'Settings';
            case 'edit-profile':
                return 'Edit Profile';
            default:
                return '';
        }
    };

    const handleFileSelect = (file: FileProps) => {
        if (onFileSelect) {
            onFileSelect(file);
            closeModal();
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4"
                    onClick={() => closeModal()}
                >
                    <div 
                        className="bg-gray-100/10 rounded-2xl backdrop-blur-sm 
                            border border-white/20 shadow-lg
                            p-4 sm:p-6 md:p-8 relative w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl
                            flex flex-col max-h-[90vh] sm:max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 sticky top-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-[80%]">
                                {getTitle()}
                            </h1>
                            <button
                                onClick={() => closeModal()}
                                className="text-white/70 text-3xl sm:text-4xl hover:text-red-400 
                                    transition-colors duration-300"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="w-full">
                            {type === 'settings' && <SettingPanel />}
                            {type === 'edit-profile' && <EditProfileForm />}
                            {type === 'createdFile' && mode === 'select' && (
                                <TableShowFile 
                                    onSelect={handleFileSelect}
                                />
                            )}
                            {type === 'createdFile' && mode === 'preview' && itemId && (
                                <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] flex flex-col gap-2 sm:gap-4">
                                    <div className="flex-1 bg-white/5 rounded-lg overflow-hidden">
                                        <iframe
                                            src={contentURL}
                                            className="w-full h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/30"
                                            title={initialValue}
                                        />
                                    </div>
                                </div>
                            )}
                            {type === 'createdFile' && mode === 'create' && <FileCreatedForm onClose={() => closeModal()} />}
                            {type === 'createdChat' && mode === 'create' && <ChatCreatedForm onClose={() => closeModal()} />}
                            {(type === 'updateChat' || type === 'updateFile') && mode === 'edit' && (
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
            )}
            {isConfirmOpen && (
                <ConfirmModal
                    message={confirmMessage || ''}
                    onConfirm={() => {
                        if (onConfirm) {
                            onConfirm();
                        }
                        closeConfirmModal();
                    }}
                    onCancel={closeConfirmModal}
                />
            )}
        </>
    );
}


