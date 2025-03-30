import { useEffect } from 'react';
import { useFileStore } from '@/modules/common/stores/fileStore';
import BarFiles from '@/modules/common/components/items/itemsFiles';

interface TableShowFileProps {
    onSelect?: (file: any) => void;
}

export default function TableShowFile({ onSelect }: TableShowFileProps) {
    const { files, loading, error: fileError, fetchFiles } = useFileStore();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <div className="flex flex-col w-full h-[50vh]">
            <div className="flex-1 relative bg-white/5 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg overflow-hidden">
                <div className="h-full overflow-y-auto px-4 py-4
                    scrollbar scrollbar-w-1.5 
                    scrollbar-track-white/5
                    scrollbar-thumb-emerald-400/50
                    hover:scrollbar-thumb-emerald-400/70
                    scrollbar-track-rounded-full
                    scrollbar-thumb-rounded-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-2xl">
                            <p className="text-white/70">Loading files...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-2xl">
                            <p className="text-white/70">No files found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <BarFiles 
                                files={files} 
                                onSelect={onSelect}
                                isInTableShowFile={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
