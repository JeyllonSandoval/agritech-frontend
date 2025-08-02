"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [token, setToken] = useState<string>("");
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadTranslations('forms');
    }, [language]);

    useEffect(() => {
        // Extraer token de la URL
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            validateToken(tokenFromUrl);
        } else {
            setMessage("Token de reset de contraseña no encontrado. Por favor, solicita un nuevo enlace.");
            setIsTokenValid(false);
        }
    }, [searchParams]);

    const validateToken = async (tokenToValidate: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/validate-reset-token/${tokenToValidate}`);
            const data = await response.json();
            
            if (response.ok) {
                setIsTokenValid(true);
                setMessage("");
            } else {
                setIsTokenValid(false);
                setMessage(data.error || "El enlace de reset de contraseña es inválido o ha expirado.");
            }
        } catch (error) {
            console.error("Error validating token:", error);
            setIsTokenValid(false);
            setMessage("Error al validar el enlace. Por favor, solicita un nuevo enlace.");
        }
    };

    useEffect(() => {
        if (isTokenValid) {
            firstInputRef.current?.focus();
        }
    }, [isTokenValid]);

    const validateField = (name: string, value: string): string | undefined => {
        let error: string | undefined;

        switch (name) {
            case 'password':
                if (!value) {
                    error = t('common.required');
                } else if (value.length < 8) {
                    error = t('common.minLength').replace('{length}', '8');
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    error = t('common.required');
                } else if (value !== password) {
                    error = t('common.passwordMismatch');
                }
                break;
        }

        return error;
    };

    const handleChange = (name: string, value: string) => {
        switch (name) {
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error || ''
            }));
        }
    };

    const handleBlur = (name: string) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const value = name === 'password' ? password : confirmPassword;
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error || ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isTokenValid) {
            setMessage("El enlace de reset de contraseña es inválido. Por favor, solicita un nuevo enlace.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        // Validate all fields
        const newErrors: Record<string, string> = {};
        let isValid = true;

        ['password', 'confirmPassword'].forEach(field => {
            const value = field === 'password' ? password : confirmPassword;
            const error = validateField(field, value);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(t('resetPassword.resetSuccess'));
                setTimeout(() => {
                    router.push("/signin");
                }, 3000);
            } else {
                setMessage(data.error || t('common.error'));
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage(t('common.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Si el token no es válido, mostrar mensaje de error
    if (isTokenValid === false) {
        return (
            <div className="flex flex-col gap-4 text-lg w-full max-w-md">
                <div className="text-red-400 bg-red-400/10 p-4 rounded-xl">
                    {message}
                </div>
                <button
                    onClick={() => router.push("/forgot-password")}
                    className="w-full px-4 py-2 text-lg rounded-xl bg-emerald-400/90 hover:bg-emerald-400
                        text-black font-medium
                        focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        transition-all duration-300
                        flex items-center justify-center gap-2"
                >
                    <span>Solicitar nuevo enlace</span>
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        );
    }

    // Si aún se está validando el token, mostrar loading
    if (isTokenValid === null) {
        return (
            <div className="flex flex-col gap-4 text-lg w-full max-w-md">
                <div className="flex items-center justify-center p-8">
                    <svg className="animate-spin h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p className="text-center text-white/70">Validando enlace...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg w-full max-w-md">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-white/70">{t('resetPassword.newPassword')}</label>
                    <div className="relative text-lg">
                        <input
                            ref={firstInputRef}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            onBlur={() => handleBlur('password')}
                            className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                                errors.password ? 'border-red-400/50' : 'border-white/20'
                            } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none pr-12`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                                text-white/40 hover:text-white/70
                                transition-colors duration-200"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70">{t('resetPassword.confirmPassword')}</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                                errors.confirmPassword ? 'border-red-400/50' : 'border-white/20'
                            } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none pr-12`}
                            required
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>
            </div>

            {message && (
                <div className={`text-sm p-3 rounded-xl ${
                    message === t('resetPassword.resetSuccess')
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-red-400 bg-red-400/10'
                }`}>
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-lg rounded-xl bg-emerald-400/90 hover:bg-emerald-400
                    text-black font-medium
                    focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t('common.loading')}</span>
                    </>
                ) : (
                    <>
                        <span>{t('resetPassword.resetButton')}</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </>
                )}
            </button>
        </form>
    );
} 