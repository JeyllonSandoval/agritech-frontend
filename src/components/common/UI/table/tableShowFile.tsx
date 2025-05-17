'use client';

import { useEffect, useState } from 'react';
import { useFileStore } from '@/store/fileStore';
import BarFiles from '@/components/common/UI/items/itemsFiles';
import { FileProps } from '@/hooks/getFiles';
import FileCreatedForm from '@/components/features/forms/fileCreatedForm';

interface TableShowFileProps {
    onSelect?: (file: FileProps) => void;
}

export default function TableShowFile({ onSelect }: TableShowFileProps) {
    const { files, loading, error: fileError, fetchFiles } = useFileStore();
    const [showUploadForm, setShowUploadForm] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleSelect = (file: FileProps) => {
        if (onSelect) {
            onSelect(file);
        }
    };

    return (
        <div className="flex flex-col w-full h-[50vh] sm:h-[60vh] md:h-[70vh] gap-2 md:gap-4">
            <div className="flex-1 relative bg-white/5 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg overflow-hidden">
                <div className="h-full overflow-y-auto px-2 sm:px-4 py-2 sm:py-4
                    scrollbar scrollbar-w-1.5 
                    scrollbar-track-white/5
                    scrollbar-thumb-emerald-400/50
                    hover:scrollbar-thumb-emerald-400/70
                    scrollbar-track-rounded-full
                    scrollbar-thumb-rounded-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-lg sm:text-2xl">
                            <p className="text-white/70">Loading files...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-lg sm:text-2xl">
                            <p className="text-white/70">No files found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <BarFiles 
                                files={files} 
                                onSelect={handleSelect}
                                isInTableShowFile={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {!showUploadForm ? (
                <button
                    onClick={() => setShowUploadForm(true)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-600/80 to-emerald-500/80
                        hover:from-emerald-500/80 hover:to-emerald-400/80
                        active:from-emerald-700/80 active:to-emerald-600/80
                        backdrop-blur-sm rounded-xl
                        border border-white/10
                        shadow-lg shadow-emerald-700/20
                        transition-all duration-300
                        text-white
                        flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 4v16m8-8H4"/>
                    </svg>
                    Upload New File
                </button>
            ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl 
                    border border-white/20 p-2 sm:p-4">
                    <FileCreatedForm onClose={() => setShowUploadForm(false)} />
                </div>
            )}
        </div>
    );
}
