"use client";
import LeftNavbar from '@/components/common/UI/navbars/LeftNavbar';
import CenterNavbar from '@/components/common/UI/navbars/CenterNavbar';
import RightNavbar from '@/components/common/UI/navbars/RightNavbar';
import { useEffect, useState } from 'react';

export default function NavbarH() {
    const [scrolled, setScrolled] = useState(false);

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

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
            <div className={`w-[98%] flex justify-center items-center transition-all duration-700 ${scrolled ? 'bg-white/10 backdrop-blur-xl mt-2 rounded-2xl' : ''}`}>
                <nav className="w-[90%] flex justify-between items-center text-white/90 pointer-events-auto">
                    <LeftNavbar />
                    <CenterNavbar />
                    <RightNavbar />
                </nav>
            </div>
        </div>
    );
}
