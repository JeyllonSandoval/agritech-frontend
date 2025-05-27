"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from '@/context/languageContext';
import formsTranslations from '@/data/Lenguage/en/forms.json';

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const translations = formsTranslations.resetPassword;
    const commonTranslations = formsTranslations.common;
    const token = searchParams.get('token');
    const passwordInputRef = useRef<HTMLInputElement>(null);
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        passwordInputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        
        if (newPassword !== confirmPassword) {
            setMessage(commonTranslations.passwordMismatch);
            return;
        }

        if (newPassword.length < 8) {
            setMessage(commonTranslations.minLength.replace('{length}', '8'));
            return;
        }

        if (!token) {
            setMessage(translations.invalidLink);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    token,
                    password: newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessages = {
                    "Invalid token": translations.invalidToken,
                    "Token expired": translations.expiredToken,
                    "Invalid password": translations.samePassword,
                    "Validation error": translations.invalidFormat
                };

                if (response.status === 400 && data.error in errorMessages) {
                    throw new Error(errorMessages[data.error as keyof typeof errorMessages]);
                }

                throw new Error(data.message || translations.resetFailed);
            }

            // Guardar el nuevo token
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setMessage(translations.resetSuccess);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            console.error("Error in password reset:", error);
            setMessage(error instanceof Error ? error.message : commonTranslations.error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full h-full flex justify-center items-center px-4">
            <form onSubmit={handleSubmit} 
                className="w-full max-w-md p-4 md:p-8 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg shadow-emerald-400/20 mt-12 md:mt-20"
            >
                <div className="flex flex-col items-center gap-4 md:gap-8">
                    <div className="text-center space-y-1 md:space-y-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-white">
                            {translations.title}
                        </h1>
                        <p className="text-xs md:text-sm text-white/70">
                            {translations.subtitle}
                        </p>
                    </div>

                    <div className="w-full space-y-3 md:space-y-4">
                        <div className="relative flex items-center">
                            <input
                                ref={passwordInputRef}
                                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                    bg-white/10 backdrop-blur-sm rounded-xl
                                    border border-white/20 text-white
                                    group-hover:border-emerald-400/30
                                    focus:border-emerald-400/50 focus:ring-2 
                                    focus:ring-emerald-400/20 focus:outline-none 
                                    placeholder-white/40
                                    transition-all duration-300"
                                type={showPassword ? "text" : "password"}
                                placeholder={translations.newPassword}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 
                                    p-1.5 rounded-lg
                                    text-white/40
                                    hover:text-emerald-400/70
                                    hover:bg-emerald-400/10
                                    active:bg-emerald-400/20
                                    transition-all duration-300
                                    focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="relative flex items-center">
                            <input
                                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                    bg-white/10 backdrop-blur-sm rounded-xl
                                    border border-white/20 text-white
                                    group-hover:border-emerald-400/30
                                    focus:border-emerald-400/50 focus:ring-2 
                                    focus:ring-emerald-400/20 focus:outline-none 
                                    placeholder-white/40
                                    transition-all duration-300"
                                type={showPassword ? "text" : "password"}
                                placeholder={translations.confirmPassword}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                bg-emerald-400/90 text-black font-medium
                                rounded-xl
                                hover:bg-emerald-400 
                                active:bg-emerald-500
                                focus:ring-2 focus:ring-emerald-400/20
                                transition-all duration-300
                                flex items-center justify-center gap-2
                                shadow-lg shadow-emerald-400/20
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{commonTranslations.loading}</span>
                                </>
                            ) : (
                                <>
                                    <span>{translations.resetButton}</span>
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {message && (
                            <div className={`text-xs md:text-sm px-3 py-2 md:px-4 md:py-3 rounded-xl 
                                flex items-center gap-2 ${
                                    message.includes(translations.resetSuccess) 
                                        ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
                                        : "bg-red-400/10 border border-red-400/20 text-red-400"
                                }`}
                            >
                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {message.includes(translations.resetSuccess) ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => router.push("/signin")}
                                className="text-xs md:text-sm text-white/50 
                                    hover:text-emerald-400/70
                                    focus:text-emerald-400
                                    transition-colors duration-300"
                            >
                                {translations.backToLogin}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
} 