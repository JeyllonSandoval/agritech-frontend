import { FileProps } from '@/modules/common/hooks/getFiles';
import ButtonShow from '@/modules/common/components/UI/CompleButtons/ButtonShow';
import { ButtonItemEdit } from '@/modules/common/components/UI/CompleButtons/ButtonItemEdit';
import { useModal } from '@/modules/common/context/modalContext';

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
    files, 
    onSelect, 
    showActions = true, 
    onShowPdf,
    isInTableShowFile = false,
    onEditFile,
    onRemoveFile
}: BarFilesProps) {
    const { openModal } = useModal();

    const handleShow = (e: React.MouseEvent, file: FileProps) => {
        e.stopPropagation();
        onShowPdf?.(file);
    };

    const handleEditFile = async (file: FileProps, newName: string) => {
        if (onEditFile) {
            onEditFile({ ...file, FileName: newName });
        }
    };

    return (
        <div className="space-y-2">
            {files.map((file) => (
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
                                onEdit={(newName) => handleEditFile(file, newName)}
                                onRemove={() => onRemoveFile?.(file)}
                                type="updateFile"
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
