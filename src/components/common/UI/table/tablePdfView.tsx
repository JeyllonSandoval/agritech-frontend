import { FileProps } from '@/hooks/getFiles';

interface TablePdfViewProps {
    file: FileProps;
}

export default function TablePdfView({ file }: TablePdfViewProps) {
    if (!file?.contentURL) {
        return (
            <div className="w-full h-[80vh] bg-gray-900/50 rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/70 text-2xl">
                    No file selected or preview not available
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[80vh] bg-gray-900/50 rounded-xl overflow-hidden">
            <div className="w-full h-full scrollbar">
                <object
                    data={file.contentURL}
                    type="application/pdf"
                    className="w-full h-full rounded-xl"
                >
                    <iframe
                        src={`${file.contentURL}#toolbar=0`}
                        className="w-full h-full border-0 rounded-xl"
                        title={file.FileName || 'PDF Preview'}
                    />
                </object>
            </div>
        </div>
    );
}
