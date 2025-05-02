import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

interface CenterNavbarProps {
    onSelect?: () => void;
}

export default function CenterNavbar({ onSelect }: CenterNavbarProps) {
    const pathname = usePathname();
    const [activeBackground, setActiveBackground] = useState({ width: 4, left: 0 });
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    // Verificar si estamos en la ruta /signin
    const isSignInRoute = pathname === '/signin';
    const isProfileRoute = pathname === '/profile';

    const links = [
        { href: "/", label: "Home" },
        { href: "/playground", label: "Playground" },
        { href: "/about", label: "About" },
    ];

    useEffect(() => {
        // Encontrar el enlace activo y actualizar el background
        const activeLink = linksRef.current.find(
            (link) => link?.getAttribute('href') === pathname
        );

        if (activeLink && !isSignInRoute && !isProfileRoute) {
            const rect = activeLink.getBoundingClientRect();
            const parentRect = activeLink.parentElement?.getBoundingClientRect();
            
            if (parentRect) {
                setActiveBackground({
                    width: rect.width,
                    left: rect.left - parentRect.left
                });
            }
        }
    }, [pathname, isSignInRoute, isProfileRoute]);

    const handleLinkClick = () => {
        if (onSelect) {
            onSelect();
        }
    };

    return (
        <div className="flex justify-center items-center  bg-white/10 backdrop-blur-sm py-1.5 px-2 rounded-full lg:w-[600px]">
            <div className="flex flex-row gap-6 lg:gap-8 text-base lg:text-lg relative justify-center items-center">
                {/* Background dinámico */}
                {!isSignInRoute && !isProfileRoute && (
                    <div
                        className="absolute h-[38px] bg-emerald-400/90 backdrop-blur-md rounded-full transition-all duration-300 ease-in-out
                            shadow-md shadow-emerald-300/90"
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
                            ${pathname === link.href && !isSignInRoute 
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
