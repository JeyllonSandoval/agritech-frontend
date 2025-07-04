import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
export default function LeftNavbar() {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('navbar').then(() => setIsLoaded(true));
    }, [language]);
    if (!isLoaded) return null;
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
                <h1 className="text-lg md:text-2xl lg:text-4xl font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 group-hover:from-emerald-300 group-hover:to-emerald-500">{t('AgriTech')}</h1>
            </Link>
        </div>
    )
}
