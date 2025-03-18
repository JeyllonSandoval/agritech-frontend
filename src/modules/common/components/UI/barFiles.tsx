import { FileProps } from '@/modules/common/services/getFiles';

interface BarFilesProps {
    files: FileProps[];
}

export default function BarFiles({ files }: BarFilesProps) {
    return (
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
    );
}
