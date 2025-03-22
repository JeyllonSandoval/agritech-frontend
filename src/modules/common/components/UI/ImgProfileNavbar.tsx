import { useState } from "react";
import DropNavbar from "./DropNavbar";

interface ImgProfileNavbarProps {
    onLogout: () => void;
}

export default function ImgProfileNavbar({ onLogout }: ImgProfileNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleClose = () => {
        setIsMenuOpen(false);
    };
    
    return (
        <>
            <div className="bg-white/40 backdrop-blur-sm rounded-full p-[2px]">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative w-10 h-10 rounded-full overflow-hidden 
                        bg-emerald-400/90 backdrop-blur-md shadow-xl shadow-emerald-300/90
                        hover:scale-105 transition-all duration-300"
                >
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


