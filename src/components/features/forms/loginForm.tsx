"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginForm() {
    const router = useRouter();
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const firstInputRef = useRef<HTMLInputElement>(null);
    const [translationsReady, setTranslationsReady] = useState(false);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        loadTranslations('forms').then(() => {
            setTranslationsReady(true);
            forceUpdate(n => n + 1);
        });
    }, [language]);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    if (!translationsReady) {
        return null;
    }

    const validateField = (name: string, value: string): string | undefined => {
        let error: string | undefined;

        switch (name) {
            case 'Email':
                if (!value) {
                    error = '';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = t('common.invalidEmail');
                }
                break;

            case 'password':
                if (!value) {
                    error = t('common.required');
                }
                break;
        }

        return error;
    };

    const handleChange = (name: string, value: string) => {
        switch (name) {
            case 'Email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
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

        const value = name === 'Email' ? Email : password;
        let error = validateField(name, value);

        if (name === 'Email' && !value) {
            error = t('common.required');
        }

        setErrors(prev => ({
            ...prev,
            [name]: error || ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        // Validar todos los campos
        const newErrors: Record<string, string> = {};
        let isValid = true;

        ['Email', 'password'].forEach(field => {
            const value = field === 'Email' ? Email : password;
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.dispatchEvent(new Event('loginStateChange'));
                router.push("/");
            } else {
                setMessage(t('login.invalidCredentials'));
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setMessage(t('login.invalidCredentials'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full h-full flex justify-center items-center">
            <form onSubmit={handleSubmit} 
                className="w-full max-w-md p-4 md:p-8 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg"
            >
                <div className="flex flex-col items-center gap-4 md:gap-8">
                    <div className="text-center space-y-1 md:space-y-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-white">
                            {t('login.title') !== 'login.title' ? t('login.title') : ''}
                        </h1>
                        <p className="text-xs md:text-sm text-white/70">
                            {t('login.subtitle')}
                        </p>
                    </div>

                    <div className="w-full space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                            <div className="relative flex items-center">
                                <input
                                    ref={firstInputRef}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300
                                        min-h-[20px]"
                                    type="text"
                                    placeholder={t('login.email')}
                                    value={Email}
                                    onChange={(e) => handleChange('Email', e.target.value)}
                                    onBlur={() => handleBlur('Email')}
                                    required
                                />
                            </div>
                            {touched.Email && errors.Email && (
                                <div className="text-xs text-red-400">{errors.Email}</div>
                            )}

                            <div className="relative group">
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300
                                            pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('login.password')}
                                        value={password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        onBlur={() => handleBlur('password')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 md:right-3 
                                            p-1 md:p-1.5 rounded-lg
                                            text-white/40
                                            hover:text-emerald-400/70
                                            hover:bg-emerald-400/10
                                            active:bg-emerald-400/20
                                            transition-all duration-300
                                            focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-xs md:text-sm text-white/50 
                                        hover:text-emerald-400/70
                                        focus:text-emerald-400
                                        transition-colors duration-300"
                                >
                                    {t('login.forgotPassword')}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                    bg-emerald-400/90 text-black font-medium
                                    rounded-xl
                                    hover:bg-emerald-400 
                                    active:bg-emerald-500
                                    focus:ring-2 focus:ring-emerald-400/20
                                    transition-all duration-300
                                    flex items-center justify-center gap-2
                                    shadow-lg shadow-emerald-400/20"
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
                                        <span>{t('login.signIn')}</span>
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {message && (
                                <div className="text-xs md:text-sm 
                                    bg-red-400/10 px-3 py-2 md:px-4 md:py-3 rounded-xl 
                                    border border-red-400/20
                                    flex items-center gap-2"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="flex-1">{message}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}



