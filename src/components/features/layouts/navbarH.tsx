"use client";
import LeftNavbar from '@/components/common/UI/navbars/LeftNavbar';
import CenterNavbar from '@/components/common/UI/navbars/CenterNavbar';
import RightNavbar from '@/components/common/UI/navbars/RightNavbar';
import { useEffect, useState, useContext, useRef } from 'react';
import { NavbarLateralContext } from '@/context/navbarLateralContext';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/languageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function NavbarH() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { isLateralOpen, onLateralToggle } = useContext(NavbarLateralContext);
    const pathname = usePathname();
    const isPlaygroundRoute = pathname.startsWith('/playground');
    const isHomeRoute = pathname === '/';
    const { language } = useLanguage();
    const { t, loadTranslations } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);

    // Asegurar que el componente está montado en el cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Función para cerrar el menú cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Verificar si el click fue fuera del menú y del botón del menú
            const target = event.target as Node;
            const menuElement = menuRef.current;
            const menuButton = document.querySelector('[data-menu-button]');
            
            // Si el click no fue en el menú ni en el botón del menú, cerrar
            if (menuElement && !menuElement.contains(target) && 
                menuButton && !menuButton.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            // Usar capture: true para detectar clicks en cualquier parte del documento
            document.addEventListener('mousedown', handleClickOutside, { capture: true });
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, { capture: true });
        };
    }, [isMenuOpen]);

    useEffect(() => {
        if (!isClient || typeof window === 'undefined') return;

        const handleScroll = () => {
            let scrollY = 0;
            
            if (isHomeRoute) {
                // Buscar el primer main que tenga overflow-y-auto
                const mains = document.querySelectorAll('main');
                for (const main of mains) {
                    const styles = window.getComputedStyle(main);
                    if (styles.overflowY === 'auto' && main.scrollHeight > main.clientHeight) {
                        scrollY = main.scrollTop;
                        break;
                    }
                }
            } else {
                scrollY = window.scrollY;
            }
            
            const isScrolled = scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        let cleanup = () => {};

        const setupScrollListener = () => {
            if (isHomeRoute) {
                const mains = document.querySelectorAll('main');
                let scrollableMain = null;
                
                for (const main of mains) {
                    const styles = window.getComputedStyle(main);
                    if (styles.overflowY === 'auto' && main.scrollHeight > main.clientHeight) {
                        scrollableMain = main;
                        break;
                    }
                }
                
                if (scrollableMain) {
                    scrollableMain.addEventListener('scroll', handleScroll, { passive: true });
                    cleanup = () => scrollableMain && scrollableMain.removeEventListener('scroll', handleScroll);
                } else {
                    // Retry después de un momento si no encontramos el elemento
                    setTimeout(setupScrollListener, 300);
                }
            } else {
                window.addEventListener('scroll', handleScroll, { passive: true });
                cleanup = () => window.removeEventListener('scroll', handleScroll);
            }
        };

        // Delay inicial para el DOM
        const timer = setTimeout(setupScrollListener, 100);
        
        return () => {
            clearTimeout(timer);
            cleanup();
        };
    }, [scrolled, isHomeRoute, isClient]);

    useEffect(() => {
        loadTranslations('navbar');
    }, [language]);

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    // No renderizar nada hasta que esté montado en el cliente
    if (!isClient) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="w-full bg-black/20 backdrop-blur-sm">
                    <nav className="w-full lg:w-[90%] mx-auto lg:px-0 flex flex-col relative">
                        <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-0">
                            <div className="w-[200px] lg:w-[250px] flex items-center">
                                <div className="animate-pulse bg-gray-300 h-8 w-24 rounded"></div>
                            </div>
                            <div className="hidden lg:flex flex-1 justify-center">
                                <div className="animate-pulse bg-gray-300 h-10 w-96 rounded-full"></div>
                            </div>
                            <div className="w-[200px] lg:w-[250px] flex justify-end">
                                <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div 
                className="w-full"
                style={{
                    background: scrolled 
                        ? 'linear-gradient(to right, rgba(5, 46, 22, 0.95), rgba(0, 0, 0, 0.95))' 
                        : isHomeRoute 
                            ? 'transparent' 
                            : 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: scrolled ? 'blur(12px)' : isHomeRoute ? 'none' : 'blur(4px)',
                    borderBottom: scrolled ? '1px solid rgba(52, 211, 153, 0.4)' : 'none',
                    boxShadow: scrolled 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
                        : '0 0 0 0 rgba(0, 0, 0, 0)',
                    transition: [
                        'background 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        'backdrop-filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        'border-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        'box-shadow 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    ].join(', '),
                    transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(-2px) scale(1)',
                    opacity: 1
                }}
            >
                <nav className="w-full lg:w-[90%] mx-auto lg:px-0 flex flex-col relative" ref={menuRef}>
                    {/* Barra superior */}
                    <div 
                        className={`flex items-center justify-between px-4 lg:px-0 transition-all duration-500 ease-out ${
                            scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
                        }`}
                    >
                        <div className="w-[200px] lg:w-[250px] flex items-center ">
                            <div className={`${isPlaygroundRoute ? 'hidden lg:block' : 'block'}`}>
                                <LeftNavbar />
                            </div>
                            {isPlaygroundRoute && (
                                <button 
                                    onClick={onLateralToggle}
                                    className="flex items-center gap-2 p-2 rounded-lg 
                                        bg-emerald-500/10 hover:bg-emerald-500/20 
                                        border border-emerald-500/20 hover:border-emerald-500/30
                                        transition-all duration-300
                                        active:scale-95 focus:outline-none
                                        lg:hidden"
                                >
                                    <svg 
                                        className={`w-6 h-6 text-emerald-400 transition-transform duration-300 ${isLateralOpen ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-emerald-400 text-lg font-medium">{t('navbarLateral.quickAccess')}</span>
                                </button>
                            )}
                        </div>
                        
                        {/* Botón de menú en móvil/tablet */}
                        <div className="lg:hidden flex justify-center relative z-50">
                            <button 
                                data-menu-button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full border"
                                style={{
                                    backgroundColor: isMenuOpen 
                                        ? 'rgba(16, 185, 129, 0.2)' 
                                        : scrolled 
                                            ? 'transparent'
                                            : 'transparent',
                                    color: isMenuOpen || scrolled ? 'rgb(110, 231, 183)' : 'white',
                                    borderColor: isMenuOpen 
                                        ? 'rgba(52, 211, 153, 0.3)' 
                                        : 'transparent',
                                    transition: [
                                        'background-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        'border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                    ].join(', '),
                                    transform: 'scale(1)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMenuOpen) {
                                        e.currentTarget.style.backgroundColor = scrolled 
                                            ? 'rgba(16, 185, 129, 0.1)' 
                                            : 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = scrolled 
                                            ? 'rgba(52, 211, 153, 0.2)' 
                                            : 'transparent';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMenuOpen) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                <svg 
                                    className="w-6 h-6"
                                    style={{
                                        transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                    }}
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
                        className="lg:hidden overflow-hidden relative z-40"
                        style={{
                            maxHeight: isMenuOpen ? '300px' : '0px',
                            opacity: isMenuOpen ? 1 : 0,
                            background: scrolled 
                                ? 'linear-gradient(to bottom, rgba(5, 46, 22, 0.3), rgba(0, 0, 0, 0.5))' 
                                : 'transparent',
                            backdropFilter: scrolled ? 'blur(4px)' : 'none',
                            borderTop: scrolled ? '1px solid rgba(52, 211, 153, 0.2)' : 'none',
                            transition: [
                                'max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                'background 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                'backdrop-filter 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                'border-top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            ].join(', '),
                            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
                        }}
                    >
                        <div 
                            className="py-2"
                            style={{
                                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-5px)'
                            }}
                        >
                            <CenterNavbar onSelect={handleMenuClose} />
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}