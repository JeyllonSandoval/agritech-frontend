import { useEffect } from 'react';
import BarFiles from '@/modules/common/components/UI/barFiles';
import ButtonCreated from '@/modules/common/components/UI/buttonCreated';
import { useFileStore } from '@/modules/common/stores/fileStore';

export default function FilesPanels() {
    const { files, loading, error, fetchFiles } = useFileStore();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

    return (
        <div className="p-8 flex flex-col gap-4 justify-center items-center h-[86vh] bg-slate-600">
            <ButtonCreated />
            <h1 className="text-5xl font-bold mb-6 text-gray-800">Your Files</h1>
            {files.length === 0 ? (
                <p className="text-gray-500 text-center">No files found</p>
            ) : (
                <BarFiles files={files} />
            )}
        </div>
    );
}
