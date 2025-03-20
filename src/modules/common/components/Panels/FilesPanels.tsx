import { useEffect, useRef, useState } from 'react';
import BarFiles from '@/modules/common/components/UI/barFiles';
import ButtonCreated from '@/modules/common/components/UI/buttonCreated';
import { useFileStore } from '@/modules/common/stores/fileStore';

export default function FilesPanels() {
    const { files, loading, error, fetchFiles } = useFileStore();
    const [showTopGradient, setShowTopGradient] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(false);
    const [mounted, setMounted] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Manejar el montaje del componente
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

    // No renderizar nada hasta que el componente esté montado
    if (!mounted) return null;

    if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

    return (
        <div className="h-full w-full flex flex-col items-center">
            {/* Header fijo */}
            <div className="flex flex-col items-center p-4">
                <h1 className="text-5xl font-bold text-gray-100 mb-4">Your Files</h1>
                <ButtonCreated />
            </div>

            {/* Contenedor con scroll y efectos de degradado */}
            <div className="flex-1 w-1/2 h-1/2 mb-10 relative border-2 border-gray-600 rounded-lg overflow-hidden">
                {/* Degradado superior */}
                {showTopGradient && (
                    <div className="absolute -top-10 -left-10 -right-10 h-32 bg-gradient-to-b from-black to-transparent z-10 transition-opacity duration-200 pointer-events-none"></div>
                )}
                
                {/* Contenedor de archivos con scroll */}
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto px-4 py-4
                        scrollbar-thin scrollbar-track-gray-800 
                        scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 
                        scrollbar-thumb-rounded-full"
                >
                    {files.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500 text-2xl">No files found</p>
                        </div>
                    ) : (
                        <BarFiles files={files} />
                    )}
                </div>

                {/* Degradado inferior */}
                {showBottomGradient && (
                    <div className="absolute -bottom-10 -left-10 -right-10 h-32 bg-gradient-to-t from-black to-transparent z-10 transition-opacity duration-200 pointer-events-none"></div>
                )}
            </div>
        </div>
    );
}
