"use client";

import { useState, useRef } from "react";
import { useLanguage } from '@/context/languageContext';
import formsTranslations from '@/data/Lenguage/en/forms.json';

interface FileCreatedFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    onClose: () => void;
}

interface FormData {
    name: string;
    file: File | null;
}

interface FormErrors {
    name?: string;
    file?: string;
    submit?: string;
}

interface FileFormData extends FormData {
    name: string;
    file: File | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileCreatedForm({ onSubmit, onCancel, onClose }: FileCreatedFormProps) {
    const { language } = useLanguage();
    const translations = formsTranslations.fileCreated;
    const commonTranslations = formsTranslations.common;
    const [formData, setFormData] = useState<FileFormData>({
        name: "",
        file: null
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = translations.nameRequired;
        }

        if (!formData.file) {
            newErrors.file = translations.fileRequired;
        } else if (formData.file.size > MAX_FILE_SIZE) {
            newErrors.file = translations.fileTooLarge;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }

            await onSubmit(formDataToSend as unknown as FileFormData);
        } catch (error) {
            console.error("Error creating file:", error);
            setErrors(prev => ({
                ...prev,
                submit: translations.error
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrors(prev => ({
                    ...prev,
                    file: translations.fileTooLarge
                }));
                return;
            }

            const validFormats = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            
            if (!validFormats.includes(fileExtension)) {
                setErrors(prev => ({
                    ...prev,
                    file: translations.invalidFormat
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                file
            }));
            setErrors(prev => ({
                ...prev,
                file: undefined
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }));
                            if (errors.name) {
                                setErrors(prev => ({
                                    ...prev,
                                    name: undefined
                                }));
                            }
                        }}
                        placeholder={translations.name}
                        className="w-full px-4 py-3 text-sm
                            bg-white/10 backdrop-blur-sm rounded-xl
                            border border-white/20 text-white
                            focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                            focus:outline-none placeholder-white/40
                            transition-all duration-300"
                    />
                    {errors.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="w-full px-4 py-3 text-sm
                            bg-white/10 backdrop-blur-sm rounded-xl
                            border border-white/20 text-white
                            focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                            focus:outline-none placeholder-white/40
                            transition-all duration-300
                            cursor-pointer
                            flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {formData.file ? formData.file.name : translations.file}
                    </label>
                    {errors.file && (
                        <p className="text-red-400 text-xs mt-1">{errors.file}</p>
                    )}
                </div>
            </div>

            {errors.submit && (
                <div className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                    {errors.submit}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-sm rounded-xl
                        border border-white/20 text-white/70
                        hover:bg-white/10 hover:text-white
                        transition-all duration-300"
                >
                    {translations.cancel}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 text-sm rounded-xl
                        transition-all duration-300
                        ${isSubmitting
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            {commonTranslations.loading}
                        </span>
                    ) : translations.upload}
                </button>
            </div>
        </form>
    );
}
