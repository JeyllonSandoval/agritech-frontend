"use client";
import { useEffect, useState } from "react";
import LoginForm from "@/components/features/forms/loginForm";
import RegisterForm from "@/components/features/forms/registerForm";
import { useLanguage } from "@/context/languageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function Signin() {
    const [isLogin, setIsLogin] = useState(true);
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadTranslations('forms').then(() => setReady(true));
    }, [language]);

    return (
        <section className="w-full max-h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-12 md:py-20">
            {/* Toggle buttons container */}
            <div className="relative w-full max-w-md mb-20 flex justify-center">
                {/* Sign In button container */}
                <div className={`absolute transition-all duration-500 ease-in-out
                    ${!isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            {ready && (
                                <>
                                    <h2 className="text-white/70 text-xs md:text-sm">
                                        {t('register.haveAccount')}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        className="text-left text-emerald-400 text-xs md:text-sm font-medium hover:underline underline-offset-2"
                                    >
                                        {t('register.signIn')}
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setIsLogin(true)}
                            className="group px-4 py-2 rounded-xl
                                bg-gradient-to-r from-emerald-700/30 to-emerald-600/30
                                hover:from-emerald-600/40 hover:to-emerald-500/40
                                active:from-emerald-800/30 active:to-emerald-700/30
                                backdrop-blur-sm
                                text-emerald-100 text-xs md:text-sm
                                transition-all duration-300
                                border border-emerald-300/50
                                overflow-hidden
                                relative
                                hover:scale-105
                                hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:-translate-x-1" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                {ready ? t('login.signIn') : 'Sign In'}
                            </span>
                            <div className="absolute inset-0 rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-700/20 to-transparent animate-border-flow"></div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Register button container */}
                <div className={`absolute transition-all duration-500 ease-in-out
                    ${isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsLogin(false)}
                            className="group px-4 py-2 rounded-xl
                                bg-gradient-to-r from-emerald-700/30 to-emerald-600/30
                                hover:from-emerald-600/40 hover:to-emerald-500/40
                                active:from-emerald-800/30 active:to-emerald-700/30
                                backdrop-blur-sm
                                text-emerald-100 text-xs md:text-sm
                                transition-all duration-300
                                border border-emerald-300/50
                                overflow-hidden
                                relative
                                hover:scale-105
                                hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {ready ? t('register.signUp') : 'Register'}
                                <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-700/20 to-transparent animate-border-flow"></div>
                            </div>
                        </button>
                        <div className="flex flex-col">
                            {ready && (
                                <>
                                    <h2 className="text-white/70 text-xs md:text-sm">
                                        {t('login.noAccount')}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="text-left text-emerald-400 text-xs md:text-sm font-medium hover:underline underline-offset-2"
                                    >
                                        {t('login.signUp')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form container */}
            <div className="w-full max-w-md">
                <div className={`transition-all duration-500 ease-in-out transform
                    ${isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
                >
                    {isLogin && <LoginForm />}
                </div>
                <div className={`transition-all duration-500 ease-in-out transform
                    ${!isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                >
                    {!isLogin && <RegisterForm />}
                </div>
            </div>
        </section>
    );
}