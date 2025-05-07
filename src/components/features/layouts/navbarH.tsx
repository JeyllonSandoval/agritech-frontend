"use client";
import LeftNavbar from '@/components/common/UI/navbars/LeftNavbar';
import CenterNavbar from '@/components/common/UI/navbars/CenterNavbar';
import RightNavbar from '@/components/common/UI/navbars/RightNavbar';
import { useEffect, useState } from 'react';

export default function NavbarH() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-10">
            <div className={`w-full lg:w-[95%] mx-auto transition-all duration-700 ${scrolled ? 'w-[98%] bg-white/10 backdrop-blur-xl mt-2 rounded-2xl' : ''}`}>
                <nav className="w-full lg:w-[90%] mx-auto px-4 lg:px-0 flex flex-col relative">
                    {/* Overlay de difuminado */}
                    <div 
                        className={`
                            fixed inset-0 bg-black/60 backdrop-blur-sm
                            transition-all duration-300
                            lg:hidden
                            ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                        `}
                        onClick={handleMenuClose}
                    />

                    {/* Barra superior */}
                    <div className={`
                        flex items-center justify-between h-16 lg:h-20
                        transition-all duration-300
                        ${isMenuOpen ? 'opacity-50 blur-sm' : 'opacity-100 blur-none'}
                    `}>
                        <div className="w-[200px] lg:w-[250px]">
                            <LeftNavbar />
                        </div>
                        
                        {/* Botón de menú en móvil/tablet */}
                        <div className="lg:hidden flex justify-center relative z-50">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`
                                    p-2 rounded-full transition-all duration-300
                                    ${isMenuOpen 
                                        ? 'bg-white text-black hover:bg-white/90' 
                                        : 'hover:bg-white/10 text-white'
                                    }
                                `}
                            >
                                <svg 
                                    className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navegación central en desktop */}
                        <div className="hidden lg:flex flex-1 justify-center">
                            <CenterNavbar />
                        </div>

                        <div className="w-[200px] lg:w-[250px] flex justify-end">
                            <RightNavbar />
                        </div>
                    </div>

                    {/* CenterNavbar en móvil y tablet */}
                    <div 
                        className={`
                            lg:hidden 
                            overflow-hidden 
                            transition-all duration-300 ease-in-out
                            relative z-40
                            ${isMenuOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                    >
                        <div className="py-2">
                            <CenterNavbar onSelect={handleMenuClose} />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
