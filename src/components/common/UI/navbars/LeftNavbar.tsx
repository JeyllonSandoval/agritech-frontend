import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function LeftNavbar() {
    const { t, loadTranslations } = useTranslation();
    const { language, isInitialized } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Asegurar hidratación correcta
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !isInitialized) return;
        
        setIsLoaded(false);
        loadTranslations('navbar').then(() => setIsLoaded(true));
    }, [language, isMounted, isInitialized]);

    // Mostrar skeleton mientras carga
    if (!isMounted || !isInitialized || !isLoaded) {
        return (
            <div className="flex items-center">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="animate-pulse bg-gray-300 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded"></div>
                    <div className="animate-pulse bg-gray-300 h-6 lg:h-8 w-20 lg:w-24 rounded"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 md:gap-4">
                <Image 
                    src={"/icon/AgriTech-Logo-_transparent_.webp"} 
                    alt="AgriTech Logo" 
                    width={100} 
                    height={100}
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16" 
                />
                <h1 className="text-lg md:text-2xl lg:text-4xl font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:from-emerald-300 group-hover:to-emerald-500">
                    {t('AgriTech') === 'AgriTech' ? 'AgriTech' : t('AgriTech')}
                </h1>
            </Link>
        </div>
    )
}
