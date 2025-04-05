import { FileProps } from '@/modules/common/hooks/getFiles';
import ButtonShow from '@/modules/common/components/UI/CompleButtons/ButtonShow';
import { ButtonItemEdit } from '@/modules/common/components/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/modules/common/context/modalContext';
import { useState } from 'react';

interface BarFilesProps {
    files: FileProps[];
    onSelect?: (file: FileProps) => void;
    showActions?: boolean;
    onShowPdf?: (file: FileProps) => void;
    isInTableShowFile?: boolean;
    onEditFile?: (file: FileProps) => void;
    onRemoveFile?: (file: FileProps) => void;
}

export default function BarFiles({ 
    files: initialFiles, 
    onSelect, 
    showActions = true, 
    onShowPdf,
    isInTableShowFile = false,
    onEditFile,
    onRemoveFile
}: BarFilesProps) {
    const [files, setFiles] = useState(initialFiles);
    const { openModal, setSelectedFile } = useModal();

    const handleShow = (e: React.MouseEvent, file: FileProps) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Opening preview for file:', {
            FileID: file.FileID,
            FileName: file.FileName
        });

        // Establecemos el archivo seleccionado
        setSelectedFile(file);
        // Abrimos el modal en modo preview
        openModal('createdFile', 'preview', file.FileName, undefined, file.FileID);
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

            // Actualizar el archivo localmente
            const updatedFiles = files.map(f => 
                f.FileID === file.FileID 
                    ? { ...f, FileName: newName }
                    : f
            );
            setFiles(updatedFiles);

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

            // Actualizar el archivo localmente
            const updatedFiles = files.filter(f => f.FileID !== file.FileID);
            setFiles(updatedFiles);

            // Notificar al componente padre si existe
            if (onRemoveFile) {
                onRemoveFile(file);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <div className="space-y-2">
            {files.map((file) => {
                console.log('Rendering file:', {
                    FileID: file.FileID,
                    FileName: file.FileName
                });
                
                return (
                    <div 
                        key={file.FileID}
                        onClick={() => onSelect?.(file)}
                        className="flex items-center justify-between p-3
                            bg-white/5 backdrop-blur-sm rounded-xl
                            border border-white/10 hover:border-emerald-400/30
                            transition-all duration-300 hover:bg-white/20
                            group"
                    >
                        <div className="flex items-center gap-2">
                            <svg 
                                className="w-5 h-5 text-white/90 group-hover:text-emerald-400/70
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
                            <h3 className="font-medium text-sm text-white/90 
                                group-hover:text-white transition-colors duration-300">
                                {file.FileName}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/70 px-2 py-1
                                group-hover:text-white/90 transition-colors duration-300">
                                {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                            {showActions && !isInTableShowFile && (
                                <ButtonShow onClick={(e) => handleShow(e, file)} />
                            )}
                            {showActions && !isInTableShowFile && (
                                <ButtonItemEdit 
                                    initialValue={file.FileName}
                                    onEdit={(newName) => {
                                        console.log('ButtonItemEdit onEdit - File data:', {
                                            FileID: file.FileID,
                                            currentName: file.FileName,
                                            newName: newName
                                        });
                                        handleEditFile(file, newName);
                                    }}
                                    onRemove={() => handleRemoveFile(file)}
                                    type="updateFile"
                                    itemId={file.FileID}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
