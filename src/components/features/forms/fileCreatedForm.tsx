'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useFileStore } from '@/store/fileStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

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
    const [isDragActive, setIsDragActive] = useState(false);
    const [translationsReady, setTranslationsReady] = useState(false);

    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();

    useEffect(() => {
        setTranslationsReady(false);
        loadTranslations('forms').then(() => setTranslationsReady(true));
    }, [language]);

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

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            validateFile(file);
            setError(null);
        }
    };

    const truncateFileName = (name: string, maxLength: number = 30) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !token) {
            setError(t('fileCreated.fileRequired'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const decodedToken = jwtDecode(token) as TokenData;
            const formData = new FormData();
            formData.append('UserID', decodedToken.UserID);
            formData.append('file', selectedFile, selectedFile.name);

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

            await fetchFiles();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('fileCreated.error'));
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = validations.fileSelected && validations.validType && validations.validSize;

    if (!translationsReady) return null;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center justify-center gap-6">
            <div className="flex flex-col w-full gap-4">
                <div>
                    <label htmlFor="fileInput" className="block text-sm text-white/70 mb-2">
                        {t('fileCreated.file')}
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
                    <div
                        className={`h-16 ${isDragActive ? 'border-emerald-400/70 bg-emerald-400/10' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
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
                            {selectedFile ? truncateFileName(selectedFile.name) : t('fileCreated.selectFile')}
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
                        <span>{t('fileCreated.file')}</span>
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
                        <span>{t('fileCreated.supportedFormats')}</span>
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
                        <span>{t('fileCreated.maxSize')}</span>
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
                    {t('fileCreated.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`px-6 py-2.5 text-sm rounded-xl
                        transition-all duration-300
                        ${!isFormValid || loading
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {loading ? t('common.loading') : (!selectedFile ? t('fileCreated.upload') : t('fileCreated.upload'))}
                </button>
            </div>
        </form>
    );
}