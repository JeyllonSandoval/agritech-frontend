'use client';
import { useModal } from '@/modules/common/context/modalContext';
import SettingPanel from '@/modules/common/components/Panels/SettingPanel';

export default function ModalCreated() {
    const { isOpen, type, mode, initialValue, onEdit, itemId, onFileSelect, contentURL, closeModal } = useModal();

    const getTitle = () => {
        switch (type) {
            case 'createdChat':
                return mode === 'preview' ? initialValue : 'Create New Chat';
            case 'createdFile':
                return mode === 'preview' ? initialValue : 'Create New File';
            case 'updateChat':
                return 'Edit Chat Name';
            case 'updateFile':
                return 'Edit File Name';
            case 'settings':
                return 'Settings';
            default:
                return '';
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 