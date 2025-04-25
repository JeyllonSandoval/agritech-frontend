'use client';

import { useEffect, useRef, useState } from 'react';
import BarFiles from '@/modules/common/components/UI/items/itemsFiles';
import ButtonCreated from '@/modules/common/components/UI/buttons/buttonCreatedFile';
import { useFileStore } from '@/modules/common/stores/fileStore';
import { FileProps } from '@/modules/common/hooks/getFiles';
import { useModal } from '@/modules/common/context/modalContext';
import NavbarLateral from '@/modules/common/components/layouts/navbarLateral';

export default function FilesPage() {
    const { files, loading, error, fetchFiles } = useFileStore();
    const { openModal, setSelectedFile } = useModal();
    const [showTopGradient, setShowTopGradient] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        fetchFiles();
    }, [fetchFiles]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowTopGradient(scrollTop > 20);
            setShowBottomGradient(scrollHeight - scrollTop - clientHeight > 20);
        }
    };

    const handleShowPdf = (file: FileProps) => {
        setSelectedFile(file);
        openModal('createdFile', 'preview', file.FileName, undefined, undefined, undefined, file.contentURL);
    };

    if (!mounted) return null;

    if (loading) return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                <div className="text-white/70 text-2xl">Loading...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                <div className="text-red-400 text-2xl">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="flex">
            <NavbarLateral 
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activePanel="files"
                onPanelChange={() => {}}
                onCreateChat={() => {
                    openModal('createdChat', 'create');
                    setSelectedFile(null);
                }}
            />
            
            <div className={`fixed top-[80px] right-0 bottom-0 transition-all duration-300 ${
                isSidebarOpen ? 'left-[300px]' : 'left-0'
            }`}>
                <div className="h-full w-full flex flex-col items-center">
                    <div className="flex items-center justify-between w-1/2 p-2">
                        <h1 className="text-4xl font-semibold text-white">Your Files</h1>
                        <ButtonCreated type="createdFile" />
                    </div>

                    <div className="flex-1 w-1/2 h-1/2 mb-10 relative 
                        bg-white/10 backdrop-blur-xl rounded-2xl 
                        border border-white/20 shadow-lg 
                        overflow-hidden">
                        
                        {showTopGradient && (
                            <div className="absolute top-0 left-0 right-0 h-32 
                                bg-gradient-to-b from-black/40 via-black/20 to-transparent
                                z-10 transition-opacity duration-300 
                                pointer-events-none">
                            </div>
                        )}
                        
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="h-full overflow-y-auto px-4 py-4
                                scrollbar scrollbar-w-1.5 
                                scrollbar-track-white/5
                                scrollbar-thumb-emerald-400/50
                                hover:scrollbar-thumb-emerald-400/70
                                scrollbar-track-rounded-full
                                scrollbar-thumb-rounded-full
                                relative z-0"
                        >
                            {files.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-white/70 text-4xl">No files found</p>
                                </div>
                            ) : (
                                <BarFiles files={files} onShowPdf={handleShowPdf} />
                            )}
                        </div>

                        {showBottomGradient && (
                            <div className="absolute bottom-0 left-0 right-0 h-32 
                                bg-gradient-to-t from-black/40 via-black/20 to-transparent
                                z-10 transition-opacity duration-300 
                                pointer-events-none">
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
