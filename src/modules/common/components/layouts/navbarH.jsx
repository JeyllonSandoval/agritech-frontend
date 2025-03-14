"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import ButtonSign from "@/modules/common/components/UI/ButtonSign";
import ButtonProfile from "@/modules/common/components/UI/ButtonProfile";
import ButtonLogout from "@/modules/common/components/UI/buttonLogout";

// Componente para la parte de autenticación
const AuthSection = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        }
    }, [pathname]);

    return isAuthenticated ? (
        <div className="flex gap-4 items-center justify-center">
            <Link href="/profile"><ButtonProfile /></Link>
            <Link href="/"><ButtonLogout /></Link>
        </div>
    ) : (
        <Link href="/signin"><ButtonSign /></Link>
    );
};

const NavbarH = () => {
    return (
        <section className="w-full fixed top-0 z-[10000] bg-transparent backdrop-blur-xl">
                    <nav className="w-full flex justify-around items-center text-white gap-[250px] py-5">
                        <h1 className="text-4xl m-0 p-0 w-[150px]">AgriTech</h1>
                        <ul className="flex list-none m-0 p-0 gap-8">
                            <li className="flex items-center w-[100px] justify-center">
                                <Link href="/" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                                    Home
                                </Link>
                            </li>
                            <li className="flex items-center w-[100px] justify-center">
                                <Link href="/playground" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                                    Playground
                                </Link>
                            </li>
                            <li className="flex items-center w-[100px] justify-center">
                                <Link href="/about" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                                    About
                                </Link>
                            </li>
                            <li className="flex items-center w-auto justify-center">
                                <AuthSection />
                            </li>
                        </ul>
                    </nav>
                </section>
    )
}

export default NavbarH;
