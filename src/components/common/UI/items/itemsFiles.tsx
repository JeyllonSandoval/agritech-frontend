'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { FileProps } from '@/hooks/getFiles';
import ButtonShow from '@/components/common/UI/CompleButtons/ButtonShow';
import { ButtonItemEdit } from '@/components/common/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/context/modalContext';
import { useFileStore } from '@/store/fileStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

interface BarFilesProps {
    files: FileProps[];
    onSelect?: (file: FileProps) => void;
    showActions?: boolean;
    onShowPdf?: (file: FileProps) => void;
    isInTableShowFile?: boolean;
    onEditFile?: (file: FileProps) => void;
    onRemoveFile?: (file: FileProps) => void;
}

export default React.memo(function BarFiles({ 
    files,
    onSelect, 
    showActions = true, 
    onShowPdf,
    isInTableShowFile = false,
    onEditFile,
    onRemoveFile
}: BarFilesProps) {
    const { openModal, setSelectedFile } = useModal();
    const removeFile = useFileStore(state => state.removeFile);
    const updateFile = useFileStore(state => state.updateFile);
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('items').then(() => setIsLoaded(true));
    }, [language]);

    const handleShow = (e: React.MouseEvent, file: FileProps) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Opening preview for file:', {
            FileID: file.FileID,
            FileName: file.FileName,
            contentURL: file.contentURL
        });

        // Abrimos el modal en modo preview
        openModal('createdFile', 'preview', file.FileName, undefined, file.FileID, undefined, file.contentURL);
    };

    const handleEditFile = async (file: FileProps, newName: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            console.log('handleEditFile - File data:', {
                FileID: file.FileID,
                currentName: file.FileName,
                newName: newName
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/file/${file.FileID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ FileName: newName })
            });

            if (!response.ok) throw new Error('Error updating file');

            // Actualizar el store
            updateFile(file.FileID, { FileName: newName });

            // Notificar al componente padre si existe
            if (onEditFile) {
                onEditFile({ ...file, FileName: newName });
            }
        } catch (error) {
            console.error('Error updating file:', error);
        }
    };

    const handleRemoveFile = async (file: FileProps) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            console.log('handleRemoveFile - File data:', {
                FileID: file.FileID,
                FileName: file.FileName
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/file/${file.FileID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error deleting file');

            // Actualizar el store
            removeFile(file.FileID);

            // Notificar al componente padre si existe
            if (onRemoveFile) {
                onRemoveFile(file);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const fileItems = useMemo(() => files.length === 0 ? [
        <div key="no-files" className="text-gray-400/70 text-center py-8">{t('noFiles')}</div>
    ] : files.map((file) => {
        // Solo un log para depuración controlada
        console.log('Rendering file:', { FileID: file.FileID, FileName: file.FileName });
        return (
            <div 
                key={file.FileID}
                onClick={() => onSelect?.(file)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3
                    bg-white/5 backdrop-blur-sm rounded-xl
                    border border-white/10 hover:border-emerald-400/30
                    transition-all duration-300 hover:bg-white/20
                    group gap-2 sm:gap-0"
            >
                <div className="flex items-center gap-2">
                    <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-emerald-400/70
                            transition-colors duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="font-medium text-xs sm:text-sm text-white/90 
                        group-hover:text-white transition-colors duration-300">
                        {file.FileName}
                    </h3>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs text-white/70 px-2 py-1
                        group-hover:text-white/90 transition-colors duration-300">
                        {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                        {showActions && !isInTableShowFile && (
                            <ButtonShow onClick={(e) => handleShow(e, file)} />
                        )}
                        {showActions && !isInTableShowFile && (
                            <ButtonItemEdit 
                                initialValue={file.FileName}
                                onEdit={(newName) => {
                                    // console.log('ButtonItemEdit onEdit - File data:', { FileID: file.FileID, currentName: file.FileName, newName: newName });
                                    handleEditFile(file, newName);
                                }}
                                onRemove={() => handleRemoveFile(file)}
                                type="updateFile"
                                itemId={file.FileID}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }), [files, onSelect, showActions, isInTableShowFile, t]);

    if (!isLoaded) return null;

    return (
        <div className="space-y-2">
            {fileItems}
        </div>
    );
});
