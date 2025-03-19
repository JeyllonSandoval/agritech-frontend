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
        <form onSubmit={handleSubmit} className="flex flex-col min-w-full items-center justify-center gap-4">
            <div className="flex flex-col w-1/2">
                <div>
                    <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
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
                            className="w-full h-full text-2xl border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 flex items-center justify-center px-4 overflow-hidden"
                        >
                            {selectedFile ? truncateFileName(selectedFile.name) : 'Click to select a file'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-center w-1/2 text-2xl">
                    {error}
                </div>
            )}

            <div className="flex justify-center items-center w-1/3">
                <button
                    type="submit"
                    disabled={loading || !selectedFile}
                    className={`text-2xl text-white w-full h-auto p-1 rounded-md transition-colors duration-300 
                        ${!selectedFile 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Uploading...' : (!selectedFile ? 'Select a file first' : 'Upload')}
                </button>
            </div>
        </form>
    );
}
