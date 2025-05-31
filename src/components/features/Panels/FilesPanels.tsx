'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import BarFiles from '@/components/common/UI/items/itemsFiles';
import ButtonCreated from '@/components/common/UI/buttons/buttonCreatedFile';
import { useFileStore } from '@/store/fileStore';
import { FileProps } from '@/hooks/getFiles';
import { useModal } from '@/context/modalContext';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface FilesPanelsProps {
    onShowPdf?: (file: FileProps) => void;
}

export default function FilesPanels({ onShowPdf }: FilesPanelsProps) {
    const { files, loading, error, fetchFiles } = useFileStore();
    const { openModal, setSelectedFile } = useModal();
    const [showTopGradient, setShowTopGradient] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(false);
    const [mounted, setMounted] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();

    useEffect(() => {
        setMounted(true);
        fetchFiles();
        loadTranslations('filesPanel');
    }, [fetchFiles, language]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowTopGradient(scrollTop > 20);
            setShowBottomGradient(scrollHeight - scrollTop - clientHeight > 20);
        }
    };

    const filesMemo = useMemo(() => files, [files]);

    const handleShowPdfMemo = useCallback((file: FileProps) => {
        if (onShowPdf) {
            onShowPdf(file);
        } else {
            setSelectedFile(file);
            openModal('createdFile', 'preview', file.FileName, undefined, undefined, undefined, file.contentURL);
        }
    }, [onShowPdf, setSelectedFile, openModal]);

    if (!mounted) return null;

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center p-2 
            fixed top-16 left-0 right-0 overflow-hidden">
            <div className="flex items-center justify-between w-full md:w-3/4 lg:w-1/2 p-2 md:p-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">{t('yourFiles')}</h1>
                <ButtonCreated type="createdFile" />
            </div>

            <div className="flex-1 w-full md:w-3/4 lg:w-1/2 h-[calc(100%-6rem)] mb-4 md:mb-10 relative 
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
                    className="h-full overflow-y-auto px-2 md:px-4 py-2 md:py-4
                        scrollbar scrollbar-w-1.5 
                        scrollbar-track-white/5
                        scrollbar-thumb-emerald-400/50
                        hover:scrollbar-thumb-emerald-400/70
                        scrollbar-track-rounded-full
                        scrollbar-thumb-rounded-full
                        relative z-0"
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-white/70 text-2xl">{t('loading')}</div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-red-400 text-2xl">{error}</div>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-white/70 text-4xl">{t('noFiles')}</p>
                        </div>
                    ) : (
                        <BarFiles files={filesMemo} onShowPdf={handleShowPdfMemo} />
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
    );
}
