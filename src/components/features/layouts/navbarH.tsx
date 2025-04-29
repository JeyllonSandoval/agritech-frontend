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
        <section className={`w-[98%] fixed top-0 z-[10] flex justify-center items-center transition-all duration-700 rounded-2xl ${scrolled ? 'bg-white/10 backdrop-blur-xl mt-4' : ''}`}>
            <nav className="w-[90%] flex justify-between items-center text-white/90 rounded-2xl">
                {/* Left section - Company name */}
                <LeftNavbar />

                {/* Middle section - Navigation links */}
                <CenterNavbar />

                {/* Right section - User profile or Sign Up button */}
                <RightNavbar />
            </nav>
        </section>
    );
}
