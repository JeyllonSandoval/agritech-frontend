'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HelpFeature {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    details: string;
}

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    namespace: string;
    features: HelpFeature[];
    title: string;
    description: string;
    footer?: string;
}

export default function HelpModal({ 
    isOpen, 
    onClose, 
    namespace, 
    features, 
    title, 
    description, 
    footer 
}: HelpModalProps) {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations(namespace).then(() => setIsLoaded(true));
    }, [language, namespace]);

    // Prevenir scroll del fondo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !isLoaded) return null;

    if (typeof window === 'undefined' || !document.body) return null;

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-100/10 backdrop-blur-md rounded-2xl 
                    border border-white/20 shadow-lg
                    p-6 md:p-8 relative w-full max-w-4xl max-h-[90vh] scrollbar
                    flex flex-col z-[9999]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-500/20">
                            {features[0] && (() => {
                                const IconComponent = features[0].icon;
                                return <IconComponent className="w-6 h-6 text-emerald-400" />;
                            })()}
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 text-white/70
                            hover:bg-white/20 hover:text-white/90
                            transition-all duration-300"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Introduction */}
                <div className="mb-8">
                    <p className="text-white/80 text-base md:text-lg leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-black/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-300"
                        >
                            
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-emerald-400 flex-shrink-0">
                                            <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-white/70 text-sm mb-3">
                                        {feature.description}
                                    </p>
                                    <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-3">
                                        <p className="text-emerald-300 text-xs leading-relaxed">
                                            {feature.details}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        
                    ))}
                </div>

                {/* Footer opcional */}
                {footer && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4">
                          <p className="text-emerald-300 text-sm text-center">
                              {footer}
                          </p>
                      </div>
                  </div>
                )}
            </div>
        </div>,
        document.body
    );
} 