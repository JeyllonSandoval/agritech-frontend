import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useState, useEffect } from 'react';

interface ButtonSelectFileProps {
    setIsModalOpen: (isOpen: boolean) => void;
    isFileSelected?: boolean;
    disabled?: boolean;
}

export default function ButtonSelectFile({ setIsModalOpen, isFileSelected, disabled }: ButtonSelectFileProps) {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('buttons').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) return null;

    // Si ya hay un archivo seleccionado, no mostrar el botón
    if (isFileSelected) {
        return null;
    }

    return (
        <div className="flex justify-center">
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={disabled}
                className={`group relative px-8 py-4
                    bg-white/10 backdrop-blur-xl
                    border-2 border-emerald-400/40
                    rounded-2xl
                    shadow-2xl shadow-emerald-400/20
                    overflow-hidden
                    transition-all duration-300
                    flex items-center gap-4
                    active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{
                    WebkitBackdropFilter: 'blur(16px)',
                    backdropFilter: 'blur(16px)'
                }}
            >
                {/* Borde doble y glow animado */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl z-0 border-4 border-transparent group-hover:border-emerald-400/60 group-hover:shadow-[0_0_32px_8px_rgba(16,185,129,0.25)] transition-all duration-500" />
                {/* Gradiente animado tipo aurora */}
                <span className="pointer-events-none absolute -inset-4 z-0 rounded-3xl bg-gradient-to-r from-emerald-400/30 via-emerald-500/20 to-cyan-400/30 animate-gradient-move opacity-80" />
                {/* Icono animado */}
                <svg 
                    className="w-10 h-10 z-10 relative transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 text-emerald-200 drop-shadow-[0_2px_12px_rgba(16,185,129,0.4)]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                </svg>
                {/* Texto con gradiente y animación */}
                <span className="text-lg font-extrabold z-10 relative bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-emerald-400 transition-all duration-500">
                    {t('selectFile')}
                </span>
                {/* Efecto de hover aurora extra */}
                <span className="pointer-events-none absolute -inset-8 z-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-emerald-400/10 to-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </button>
            {/* Animación de gradiente personalizada */}
            <style jsx>{`
                @keyframes gradient-move {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-move {
                    background-size: 200% 200%;
                    animation: gradient-move 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
