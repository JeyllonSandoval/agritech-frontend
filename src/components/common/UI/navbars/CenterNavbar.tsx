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
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    // Verificar si estamos en rutas específicas donde no queremos mostrar el background
    const isSignInRoute = pathname === '/signin';
    const isProfileRoute = pathname === '/profile';
    const isForgotPasswordRoute = pathname === '/forgot-password';
    const isVerifyEmailRoute = pathname === '/verify-email';
    const isResetPasswordRoute = pathname === '/reset-password';
    const isPlaygroundRoute = pathname.startsWith('/playground');

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('navbar').then(() => setIsLoaded(true));
    }, [language]);

    useLayoutEffect(() => {
        // recalcula el background solo cuando isLoaded es true
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
    }, [pathname, isSignInRoute, isProfileRoute, isForgotPasswordRoute, isVerifyEmailRoute, isResetPasswordRoute, isPlaygroundRoute, isLoaded, language]);

    const handleLinkClick = () => {
        if (onSelect) {
            onSelect();
        }
    };

    if (!isLoaded) return null;

    const links = [
        { href: "/", label: t('navbar.home') },
        { href: "/playground", label: t('navbar.playground') },
        { href: "/telemetry", label: t('navbar.telemetry') },
        { href: "/about", label: t('navbar.about') },
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
