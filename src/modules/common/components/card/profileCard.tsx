"use client";
import { useProfile } from "@/modules/common/hooks/useProfile";
import ButtonEditProfile from "../UI/buttons/buttonEditProfile";
import { useEffect, useState } from "react";

export default function ProfileCard() {
    const { userData, countryName, isLoading, error, refreshProfile } = useProfile();
    const [isUpdating, setIsUpdating] = useState(false);

    // Add refresh mechanism
    useEffect(() => {
        const handleProfileUpdate = async (event: Event) => {
            const customEvent = event as CustomEvent;
            setIsUpdating(true);
            // If we have the updated user data in the event, use it directly
            if (customEvent.detail) {
                // Update the local state with the new data
                // This will trigger a re-render with the new data
                // The useProfile hook will eventually catch up with the refresh
                await refreshProfile();
            } else {
                // If no data in the event, just refresh
                await refreshProfile();
            }
            // Add a small delay to show the update animation
            setTimeout(() => {
                setIsUpdating(false);
            }, 300);
        };

        // Listen for profile updates
        window.addEventListener('profile-updated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profile-updated', handleProfileUpdate);
        };
    }, []);

    if (isLoading && !userData) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                    <div className="text-white/70 text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                    <div className="text-red-400 text-2xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full h-full flex justify-center items-center px-4 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
            <div className="w-full max-w-md p-8 
                bg-white/10 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg">
                {userData && (
                    <section className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="bg-white/40 backdrop-blur-sm rounded-full p-[2px]">
                                <div className="w-24 h-24 rounded-full overflow-hidden 
                                    bg-emerald-400/90 backdrop-blur-md shadow-xl shadow-emerald-300/90
                                    border-2 border-white/20">
                                    <img
                                        src={userData.imageUser}
                                        alt={`${userData.FirstName} ${userData.LastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full 
                                border-2 border-white/20 shadow-lg backdrop-blur-md
                                ${userData.status === "active" 
                                    ? "bg-emerald-400/90" 
                                    : "bg-red-400/90"}`}>
                            </span>
                        </div>
                        
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-white">
                                {userData.FirstName} {userData.LastName}
                            </h1>
                        </div>

                        <div className="w-full space-y-2">
                            {countryName && (
                                <div className="flex items-center space-x-3 text-sm px-4 py-3
                                    hover:bg-emerald-400/90 hover:text-black rounded-xl
                                    transition-all duration-300 text-white/70">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                                    </svg>
                                    <span>{countryName}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-3 text-sm px-4 py-3
                                hover:bg-emerald-400/90 hover:text-black rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <div className="flex items-center justify-between w-full">
                                    <span>{userData.Email}</span>
                                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs
                                        ${userData.emailVerified 
                                            ? "bg-emerald-400/20 text-emerald-400" 
                                            : "bg-red-400/20 text-red-400"}`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {userData.emailVerified ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            )}
                                        </svg>
                                        <span>{userData.emailVerified ? "Verified" : "Unverified"}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm px-4 py-3
                                hover:bg-emerald-400/90 hover:text-black rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>{userData.createdAt}</span>
                            </div>
                        </div>

                        <div className="w-full border-t border-white/20 pt-4 flex justify-between items-center">
                            <div className={`flex w-24 items-center px-4 py-2 rounded-xl text-sm
                                transition-all duration-300
                                ${userData.status === "active" 
                                    ? "bg-emerald-400/90 text-black" 
                                    : "bg-red-400/90 text-white"}`}>
                                <span className={`w-2 h-2 mr-2 rounded-full bg-white/80`}></span>
                                {userData.status === "active" ? "Active" : "Inactive"}
                            </div>
                            <ButtonEditProfile />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

