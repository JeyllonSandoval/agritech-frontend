import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useMemo } from "react";
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
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    // Verificar si estamos en rutas específicas donde no queremos mostrar el background
    const isSignInRoute = pathname === '/signin';
    const isProfileRoute = pathname === '/profile';
    const isForgotPasswordRoute = pathname === '/forgot-password';
    const isVerifyEmailRoute = pathname === '/verify-email';
    const isResetPasswordRoute = pathname === '/reset-password';
    const isPlaygroundRoute = pathname.startsWith('/playground');

    const links = useMemo(() => [
        { href: "/", label: t('home') },
        { href: "/playground", label: t('playground') },
        { href: "/about", label: t('about') },
    ], [t, language]);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('navbar').then(() => setIsLoaded(true));
    }, [language]);

    useEffect(() => {
        // Encontrar el enlace activo y actualizar el background
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
    }, [pathname, isSignInRoute, isProfileRoute, isForgotPasswordRoute, isVerifyEmailRoute, isResetPasswordRoute, isPlaygroundRoute]);

    const handleLinkClick = () => {
        if (onSelect) {
            onSelect();
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm py-1 px-2 rounded-full lg:w-[600px] lg:h-[44px]">
            <div className="flex flex-row gap-3 lg:gap-8 text-base lg:text-lg relative justify-center items-center">
                {/* Background dinámico */}
                {!isSignInRoute && !isProfileRoute && !isForgotPasswordRoute && !isVerifyEmailRoute && !isResetPasswordRoute && (
                    <div
                        className="absolute h-[38px] bg-emerald-600/90 backdrop-blur-md rounded-full transition-all duration-300 ease-in-out"
                        style={{
                            width: `${activeBackground.width}px`,
                            left: `${activeBackground.left}px`,
                            opacity: 1,
                        }}
                    />
                )}
                
                {/* Enlaces */}
                {links.map((link, index) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        ref={(el) => {
                            linksRef.current[index] = el;
                        }}
                        onClick={handleLinkClick}
                        className={`px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative z-10 
                            ${(pathname === link.href || (link.href === '/playground' && isPlaygroundRoute)) && 
                              !isSignInRoute && !isProfileRoute && !isForgotPasswordRoute && !isVerifyEmailRoute && !isResetPasswordRoute
                                ? 'text-white font-medium scale-105' 
                                : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
