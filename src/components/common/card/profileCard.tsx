"use client";
import { useProfile } from "@/hooks/useProfile";
import ButtonEditProfile from "../UI/buttons/buttonEditProfile";
import { useEffect, useState } from "react";
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

export default function ProfileCard() {
    const { userData, countryName, isLoading, error, refreshProfile } = useProfile();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    // Add refresh mechanism
    useEffect(() => {
        const handleProfileUpdate = async (event: Event) => {
            const customEvent = event as CustomEvent;
            setIsUpdating(true);
            if (customEvent.detail) {
                await refreshProfile();
            } else {
                await refreshProfile();
            }
            setTimeout(() => {
                setIsUpdating(false);
            }, 300);
        };

        window.addEventListener('profile-updated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profile-updated', handleProfileUpdate);
        };
    }, []);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('card').then(() => setIsLoaded(true));
    }, [language]);

    const handleResendVerification = async () => {
        if (isResending || !userData) return;
        
        setIsResending(true);
        setResendMessage("");
        
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/resend-verification`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: userData.Email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send verification email");
            }

            setResendMessage("Verification email sent successfully!");
        } catch (error) {
            console.error("Error resending verification email:", error);
            setResendMessage(error instanceof Error ? error.message : "Error sending verification email");
        } finally {
            setIsResending(false);
        }
    };

    if (isLoading && !userData) {
        return (
            <div className="w-full h-full flex justify-center items-center p-2 sm:p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="text-white/70 text-lg sm:text-xl md:text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center p-2 sm:p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="text-red-400 text-lg sm:text-xl md:text-2xl">{error}</div>
                </div>
            </div>
        );
    }

    if (!isLoaded) return null;

    return (
        <div className={`w-full h-full flex justify-center items-center px-2 sm:px-4 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
            <div className="w-full max-w-md p-4 sm:p-6 md:p-8 
                bg-white/10 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg">
                {userData && (
                    <section className="flex flex-col items-center space-y-4 sm:space-y-6">
                        <div className="relative">
                            <div className="bg-white/40 backdrop-blur-sm rounded-full p-[2px]">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden 
                                    bg-emerald-400/90 backdrop-blur-md shadow-xl shadow-emerald-300/90
                                    border-2 border-white/20">
                                    {userData.imageUser ? (
                                        <img
                                            src={userData.imageUser}
                                            alt={`${userData.FirstName} ${userData.LastName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg 
                                            className="w-full h-full p-3 sm:p-4 text-black" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className={`absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full 
                                border-2 border-white/20 shadow-lg backdrop-blur-md
                                ${userData.status === "active" 
                                    ? "bg-emerald-400/90" 
                                    : "bg-red-400/90"}`}>
                            </span>
                        </div>
                        
                        <div className="text-center">
                            <h1 className="text-lg sm:text-xl font-semibold text-white">
                                {userData.FirstName} {userData.LastName}
                            </h1>
                        </div>

                        <div className="w-full space-y-2">
                            {countryName && (
                                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3
                                    hover:bg-green-500/20 hover:text-green-100 rounded-xl
                                    transition-all duration-300 text-white/70">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                                    </svg>
                                    <span>{countryName}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3
                                hover:bg-green-500/20 hover:text-green-100 rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <div className="flex items-center justify-between w-full">
                                    <span className="truncate max-w-[180px] sm:max-w-[240px]">{userData.Email}</span>
                                    {userData.emailVerified === "true" ? (
                                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] sm:text-xs
                                            bg-emerald-400/20 text-emerald-400">
                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{t('verified')}</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleResendVerification}
                                            disabled={isResending}
                                            className="flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] sm:text-xs
                                                bg-red-400/20 text-red-400
                                                hover:bg-red-400/30
                                                transition-all duration-300
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isResending ? (
                                                <svg className="animate-spin h-2.5 w-2.5 sm:h-3 sm:w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                            <span>{t('resend')}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {resendMessage && (
                                <div className={`text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
                                    ${resendMessage.includes("successfully") 
                                        ? "bg-emerald-400/20 text-emerald-400" 
                                        : "bg-red-400/20 text-red-400"}`}
                                >
                                    {resendMessage}
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3
                                hover:bg-green-500/20 hover:text-green-100 rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>{userData.createdAt}</span>
                            </div>
                        </div>

                        <div className="w-full border-t border-white/20 pt-3 sm:pt-4 flex justify-between items-center">
                            <div className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs
                                transition-all duration-300
                                ${userData.status === "active"
                                    ? "bg-emerald-400/20 text-emerald-400"
                                    : "bg-red-400/20 text-red-400"}`}>
                                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 mr-1 sm:mr-1.5 rounded-full 
                                    ${userData.status === "active" 
                                        ? "bg-emerald-400" 
                                        : "bg-red-400"}`}>
                                </span>
                                {userData.status === "active" ? t('active') : t('inactive')}
                            </div>
                            <ButtonEditProfile />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

