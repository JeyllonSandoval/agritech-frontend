import { useState, useEffect } from "react";
import DropNavbar from "./DropNavbar";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";


interface ImgProfileNavbarProps {
    onLogout: () => void;
}

export default function ImgProfileNavbar({ onLogout }: ImgProfileNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userData, isLoading, refreshProfile } = useProfile();
    
    useEffect(() => {
        const handleProfileUpdate = async () => {
            await refreshProfile();
        };

        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => {
            window.removeEventListener('profile-updated', handleProfileUpdate);
        };
    }, [refreshProfile]);

    const handleClose = () => {
        setIsMenuOpen(false);
    };
    
    return (
        <>
            <div className="bg-white/40 backdrop-blur-sm rounded-full p-1">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="group relative w-10 h-10 rounded-full overflow-hidden 
                        bg-emerald-400/90 backdrop-blur-md shadow-sm shadow-emerald-300/90
                        hover:scale-105 transition-all duration-300"
                >
                    {!isLoading && userData?.imageUser ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={userData.imageUser}
                                alt={`${userData.FirstName} ${userData.LastName}`}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100
                                    bg-gradient-to-br from-transparent via-white/50 to-transparent
                                    rotate-[30deg] transform translate-x-[-100%] group-hover:translate-x-[100%]
                                    transition-all duration-700 ease-in-out"
                                style={{ width: '200%' }}
                            />
                        </div>
                    ) : (
                        <svg 
                            className="w-full h-full p-2 text-black" 
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
                </button>
            </div>

            {isMenuOpen && (
                <DropNavbar 
                    onLogout={onLogout}
                    onClose={handleClose}
                />
            )}
        </>
    );
}


