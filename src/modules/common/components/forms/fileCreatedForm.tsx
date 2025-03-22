import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useFileStore } from '@/modules/common/stores/fileStore';

interface FileCreatedFormProps {
    onClose: () => void;
}

interface TokenData {
    UserID: string;
}

export default function FileCreatedForm({ onClose }: FileCreatedFormProps) {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { fetchFiles } = useFileStore();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const truncateFileName = (name: string, maxLength: number = 30) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !token) {
            setError('Please select a file and ensure you are logged in');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const decodedToken = jwtDecode(token) as TokenData;
            const formData = new FormData();
            formData.append('UserID', decodedToken.UserID);
            formData.append('file', selectedFile);

            console.log('Sending:', {
                UserID: decodedToken.UserID,
                file: selectedFile
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/file`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            console.log('Response status:', response.status);
            const responseData = await response.json().catch(() => null);
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData?.message || `Error: ${response.status} - ${response.statusText}`);
            }

            await fetchFiles();
            onClose();
        } catch (error) {
            console.error('Error details:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred while uploading the file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center justify-center gap-6">
            <div className="flex flex-col w-full gap-4">
                <div>
                    <label htmlFor="fileInput" className="block text-sm text-white/70 mb-2">
                        Select File
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                        required
                    />
                    <div className="h-16">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full text-sm border-2 
                                border-dashed border-white/20 rounded-xl 
                                text-white/70 
                                hover:border-emerald-400/50 hover:text-emerald-400/70
                                transition-all duration-300 
                                flex items-center justify-center px-4 
                                bg-white/5 backdrop-blur-sm"
                        >
                            {selectedFile ? truncateFileName(selectedFile.name) : 'Click to select a file'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 w-full">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm rounded-xl
                        border border-white/20 text-white/70
                        hover:bg-white/10 hover:text-white
                        transition-all duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !selectedFile}
                    className={`px-6 py-2.5 text-sm rounded-xl
                        transition-all duration-300
                        ${!selectedFile || loading
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {loading ? 'Uploading...' : (!selectedFile ? 'Select a file first' : 'Upload')}
                </button>
            </div>
        </form>
    );
}
