'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import SectionContent from './SectionContent';
import * as FaIcons from 'react-icons/fa';

interface Section {
    id: string;
    title: string;
    icon: string;
    content: {
        type: string;
        description?: string;
        items?: Array<{
            title: string;
            icon: string;
            description: string;
        }>;
        mission?: {
            title: string;
            icon: string;
            items: string[];
        };
        vision?: {
            title: string;
            icon: string;
            items: string[];
        };
    };
}

export default function AboutContent() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const { t, loadTranslations, getNamespace } = useTranslation();
    const { language } = useLanguage();
    const [aboutData, setAboutData] = useState<any>(null);

    useEffect(() => {
        loadTranslations('about').then(() => {
            setAboutData(getNamespace());
        });
    }, [language]);

    const getIcon = (iconName: string) => {
        const IconComponent = (FaIcons as any)[iconName];
        return IconComponent ? <IconComponent className="w-6 h-6 text-emerald-400" /> : null;
    };

    if (!aboutData) return null;

    return (
        <div className="w-full max-w-7xl mx-auto lg:w-5/6 xl:w-2/3 min-h-screen text-white">
            {/* Company Info Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 md:mb-16"
            >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6">
                    <Image
                        src={aboutData.companyInfo.logo}
                        alt={aboutData.companyInfo.name}
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                    {aboutData.companyInfo.name}
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-4">
                    {aboutData.companyInfo.slogan}
                </p>
            </motion.div>

            {/* Sections */}
            <div className="w-full mx-auto space-y-4 md:space-y-6">
                {aboutData.sections.map((section: Section) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-emerald-400/30 transition-colors duration-300"
                    >
                        <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                {getIcon(section.icon)}
                                <h2 className="text-xl md:text-2xl font-semibold text-white">{section.title}</h2>
                            </div>
                            <span className="text-xl md:text-2xl text-emerald-400 transform transition-transform duration-300">
                                {expandedSection === section.id ? '−' : '+'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {expandedSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 md:p-6 border-t border-white/10">
                                        <SectionContent content={section.content} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
} 