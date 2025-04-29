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
                            {type === 'settings' && <SettingPanel />}
                            {type === 'edit-profile' && <EditProfileForm />}
                            {type === 'createdFile' && mode === 'select' && (
                                <TableShowFile 
                                    onSelect={handleFileSelect}
                                />
                            )}
                            {type === 'createdFile' && mode === 'preview' && itemId && (
                                <div className="w-full h-[70vh] flex flex-col gap-4">
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


