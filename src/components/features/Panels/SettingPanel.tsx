'use client';

import { useState } from 'react';
import { useModal } from '@/context/modalContext';
import SettingButton from '@/components/common/UI/buttons/SettingButton';
import { chatService } from '@/services/chatService';
import { fileService } from '@/services/fileService';
import { useChatStore } from '@/store/chatStore';
import { useFileStore } from '@/store/fileStore';

export default function SettingPanel() {
    const { closeModal, openConfirmModal } = useModal();
    const clearChats = useChatStore(state => state.clearChats);
    const clearFiles = useFileStore(state => state.clearFiles);
    const [settings, setSettings] = useState({
        theme: 'dark',
        notifications: true,
        language: 'en'
    });

    const handleLanguageChange = (newLanguage: string) => {
        setSettings(prev => ({
            ...prev,
            language: newLanguage
        }));
        // Aquí iría la lógica para cambiar el idioma de la aplicación
    };

    const handleDeleteChats = () => {
        openConfirmModal(
            'Are you sure you want to delete all your chats? This action cannot be undone.',
            async () => {
                try {
                    await chatService.deleteAllChats();
                    clearChats();
                } catch (error) {
                    console.error('Error deleting chats:', error);
                    // You might want to show an error message to the user here
                }
            }
        );
    };

    const handleDeleteFiles = () => {
        openConfirmModal(
            'Are you sure you want to delete all your files? This action cannot be undone.',
            async () => {
                try {
                    await fileService.deleteAllFiles();
                    clearFiles();
                } catch (error) {
                    console.error('Error deleting files:', error);
                    // You might want to show an error message to the user here
                }
            }
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <div className="">
                <div className="space-y-8">
                    {/* Language Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            <h3 className="text-xl font-semibold text-white">Language</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SettingButton
                                icon={
                                    <svg className={`w-6 h-6 ${settings.language === 'en' ? 'text-emerald-400' : 'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                }
                                title="English"
                                description="Switch to English"
                                onClick={() => handleLanguageChange('en')}
                                variant={settings.language === 'en' ? 'default' : 'inactive'}
                            />
                            <SettingButton
                                icon={
                                    <svg className={`w-6 h-6 ${settings.language === 'es' ? 'text-emerald-400' : 'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                }
                                title="Español"
                                description="Cambiar a Español"
                                onClick={() => handleLanguageChange('es')}
                                variant={settings.language === 'es' ? 'default' : 'inactive'}
                            />
                        </div>
                    </div>

                    {/* Delete Options */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <h3 className="text-xl font-semibold text-white">Data Management</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SettingButton
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                title="Delete All Chats"
                                description="Remove all your chat history"
                                onClick={handleDeleteChats}
                                variant="danger"
                            />
                            <SettingButton
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                title="Delete All Files"
                                description="Remove all your uploaded files"
                                onClick={handleDeleteFiles}
                                variant="danger"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 