'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useFileStore } from '@/store/fileStore';

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
    const [validations, setValidations] = useState({
        fileSelected: false,
        validType: false,
        validSize: false
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const validateFile = (file: File | null) => {
        if (!file) {
            setValidations({
                fileSelected: false,
                validType: false,
                validSize: false
            });
            return;
        }

        setValidations({
            fileSelected: true,
            validType: file.type === 'application/pdf',
            validSize: file.size <= 10 * 1024 * 1024 // 10MB máximo
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
        validateFile(file || null);
        setError(null);
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
            
            // Agregar UserID como string
            formData.append('UserID', decodedToken.UserID);
            
            // Agregar el archivo con el nombre correcto
            formData.append('file', selectedFile, selectedFile.name);

            console.log('Sending file upload request:', {
                UserID: decodedToken.UserID,
                fileName: selectedFile.name,
                fileSize: selectedFile.size
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/file`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error: ${response.status} - ${response.statusText}`);
            }

            // Actualizar la lista de archivos
            await fetchFiles();
            onClose();
        } catch (error) {
            console.error('Error uploading file:', error);
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

                {/* Validadores dinámicos */}
                <div className="text-xs space-y-1 px-2">
                    <div className={`flex items-center gap-2 ${
                        validations.fileSelected ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.fileSelected ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>File selected</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                        validations.validType ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.validType ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>Valid PDF format</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                        validations.validSize ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.validSize ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>Size less than 10MB</span>
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
