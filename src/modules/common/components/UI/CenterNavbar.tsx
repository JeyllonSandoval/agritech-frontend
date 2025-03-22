import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CenterNavbar() {
const [activeLink, setActiveLink] = useState<string>(usePathname());
const pathname = usePathname();


const linkStyles = {
    "/": { width: '100px', left: '0px' },
    "/playground": { width: '136px', left: '134px' },
    "/about": { width: '104px', left: '302px' },
};

const handleLinkClick = (path: string) => {
    setActiveLink(path);
};

// Verificar si estamos en la ruta /signin
const isSignInRoute = pathname === '/signin';
const isProfileRoute = pathname === '/profile';

return (
    <div className="flex-1 flex justify-center items-center bg-white/10 backdrop-blur-sm py-[2px] rounded-full">
        <div className="flex gap-8 text-lg relative justify-center items-center">
            {/* Solo mostrar el fondo verde si no estamos en /signin */}
            {!isSignInRoute && !isProfileRoute && (
                <div
                    className="absolute h-[34px] bg-emerald-400/90 backdrop-blur-md rounded-full transition-all duration-300 ease-in-out -translate-x-1
                        shadow-xl shadow-emerald-300/90"
                    style={{
                        width: linkStyles[activeLink as keyof typeof linkStyles]?.width,
                        left: linkStyles[activeLink as keyof typeof linkStyles]?.left,
                        opacity: 1,
                    }}
                />
            )}
            <Link
                href="/"
                onClick={() => handleLinkClick('/')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative z-10 
                    ${pathname === '/' && !isSignInRoute ? 'text-white font-medium scale-105' : 'text-gray-400'}`}
            >
                Home
            </Link>
            <Link
                href="/playground"
                onClick={() => handleLinkClick('/playground')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative z-10
                    ${pathname === '/playground' && !isSignInRoute ? 'text-white font-medium scale-105' : 'text-gray-400'}`}
            >
                Playground
            </Link>
            <Link
                href="/about"
                onClick={() => handleLinkClick('/about')}
                className={`px-5 py-1.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 relative z-10
                    ${pathname === '/about' && !isSignInRoute ? 'text-white font-medium scale-105' : 'text-gray-400'}`}
            >
                About
            </Link>
        </div>
    </div>
);
}
