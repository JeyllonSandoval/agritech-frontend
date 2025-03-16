import { useEffect, useState } from 'react';
import { getFiles, FileProps } from '@/modules/common/services/getFiles';

export default function FilesPanels() {
    const [files, setFiles] = useState<FileProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const userFiles = await getFiles();
                setFiles(userFiles);
            } catch (error) {
                setError('Error loading files');
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

    return (
        <div className="p-8 flex flex-col gap-4 justify-center items-center h-[86vh] bg-slate-600">
            <h1 className="text-5xl font-bold mb-6 text-gray-800">Your Files</h1>
            {files.length === 0 ? (
                <p className="text-gray-500 text-center">No files found</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {files.map((file) => (
                        <div 
                            key={file.FileID}
                            className="p-4 bg-gray-300 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-semibold text-lg mb-2">{file.filename}</h3>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
