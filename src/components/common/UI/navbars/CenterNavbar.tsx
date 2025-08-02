import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

interface CenterNavbarProps {
    onSelect?: () => void;
}

export default function CenterNavbar({ onSelect }: CenterNavbarProps) {
    const pathname = usePathname();
    const [activeBackground, setActiveBackground] = useState({ width: 4, left: 0 });
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const { t, loadTranslations } = useTranslation();
    const { language, isInitialized: isLanguageInitialized } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Verificar si estamos en rutas específicas donde no queremos mostrar el background
    const isSignInRoute = pathname === '/signin';
    const isProfileRoute = pathname === '/profile';
    const isForgotPasswordRoute = pathname === '/forgot-password';
    const isVerifyEmailRoute = pathname === '/verify-email';
    const isResetPasswordRoute = pathname === '/reset-password';
    const isPlaygroundRoute = pathname.startsWith('/playground');

    // Asegurar hidratación correcta
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !isLanguageInitialized) return;
        
        setIsLoaded(false);
        loadTranslations('navbar').then(() => {
            setIsLoaded(true);
        });
    }, [language, isMounted, isLanguageInitialized]);

    useLayoutEffect(() => {
        // recalcula el background solo cuando está montado y el idioma inicializado
        if (!isMounted || !isLanguageInitialized) return;
        
        const activeLink = linksRef.current.find(
            (link) => link?.getAttribute('href') === pathname ||
            (link?.getAttribute('href') === '/playground' && isPlaygroundRoute)
        );
        if (activeLink && !isSignInRoute && !isProfileRoute && !isForgotPasswordRoute && !isVerifyEmailRoute && !isResetPasswordRoute) {
            const rect = activeLink.getBoundingClientRect();
            const parentRect = activeLink.parentElement?.getBoundingClientRect();
            if (parentRect) {
                setActiveBackground({
                    width: rect.width,
                    left: rect.left - parentRect.left
                });
            }
        }
    }, [pathname, isSignInRoute, isProfileRoute, isForgotPasswordRoute, isVerifyEmailRoute, isResetPasswordRoute, isPlaygroundRoute, isMounted, isLanguageInitialized, language]);

    const handleLinkClick = () => {
        if (onSelect) {
            onSelect();
        }
    };

    // No renderizar hasta que esté montado y el idioma inicializado para evitar problemas de hidratación
    if (!isMounted || !isLanguageInitialized) {
        return (
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-2xl py-2 px-2 m-2 rounded-xl lg:w-[600px] lg:h-[44px] lg:rounded-full lg:backdrop-blur-none">
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 text-base lg:text-lg relative justify-center items-center">
                    <div className="animate-pulse flex space-x-4">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Función para obtener traducción con fallback
    const getTranslation = (key: string, fallback: string) => {
        const translation = t(key);
        return translation === key ? fallback : translation;
    };

    const links = [
        { href: "/", label: getTranslation('navbar.home', 'Inicio') },
        { href: "/playground", label: getTranslation('navbar.playground', 'Playground') },
        { href: "/telemetry", label: getTranslation('navbar.telemetry', 'Telemetría') },
        { href: "/about", label: getTranslation('navbar.about', 'Nosotros') },
    ];

    return (
        <div className="flex justify-center items-center bg-white/10 backdrop-blur-2xl py-2 px-2 m-2 rounded-xl lg:w-[600px] lg:h-[44px] lg:rounded-full lg:backdrop-blur-none">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 text-base lg:text-lg relative justify-center items-center">
                {/* Background dinámico solo en desktop */}
                {!isSignInRoute && !isProfileRoute && !isForgotPasswordRoute && !isVerifyEmailRoute && !isResetPasswordRoute && (
                    <div
                        className="absolute h-[38px] bg-emerald-600/90 backdrop-blur-md rounded-full transition-all duration-300 ease-in-out hidden lg:block"
                        style={{
                            width: `${activeBackground.width}px`,
                            left: `${activeBackground.left}px`,
                            opacity: 1,
                        }}
                    />
                )}
                {/* Enlaces */}
                {links.map((link, index) => {
                    const isActive = (pathname === link.href || (link.href === '/playground' && isPlaygroundRoute)) &&
                        !isSignInRoute && !isProfileRoute && !isForgotPasswordRoute && !isVerifyEmailRoute && !isResetPasswordRoute;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            ref={(el) => {
                                linksRef.current[index] = el;
                            }}
                            onClick={handleLinkClick}
                            className={`px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative z-10 
                                ${isActive ? 'text-white font-medium scale-105' : 'text-gray-400 hover:bg-white/5'}
                                ${isActive ? 'lg:bg-transparent bg-emerald-600/90' : ''}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
