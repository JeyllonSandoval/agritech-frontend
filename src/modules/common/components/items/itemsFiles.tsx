import { FileProps } from '@/modules/common/hooks/getFiles';

interface BarFilesProps {
    files: FileProps[];
    onSelect?: (file: FileProps) => void;
}

export default function BarFiles({ files, onSelect }: BarFilesProps) {
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
                        cursor-pointer"
                >
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-white/70 px-2 py-1
                            group-hover:text-white/90 transition-colors duration-300">
                            {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                        <button 
                            className="p-2 rounded-lg hover:bg-emerald-400/20 
                                text-white/90 hover:text-emerald-400
                                transition-all duration-300"
                        >
                            <svg 
                                className="w-4 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </button>
                        <button
                            className="p-2 rounded-lg hover:bg-emerald-400/20 
                                text-white/90 hover:text-emerald-400
                                transition-all duration-300"
                        >
                            <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
