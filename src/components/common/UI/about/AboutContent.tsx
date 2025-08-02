'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
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
    const [activeSection, setActiveSection] = useState<string>('project-overview');
    const [scrollProgress, setScrollProgress] = useState(0);
    const { t, loadTranslations, getNamespace } = useTranslation();
    const { language } = useLanguage();
    const [aboutData, setAboutData] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setScrollProgress(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        loadTranslations('about').then(() => {
            setAboutData(getNamespace());
        });
    }, [language]);

    const getIcon = (iconName: string, className?: string) => {
        const IconComponent = (FaIcons as any)[iconName];
        return IconComponent ? (
            <IconComponent 
                className={`${className || "w-full h-full"} flex-shrink-0`} 
                style={{ 
                    display: 'block',
                    margin: 'auto',
                    lineHeight: '1'
                }}
            />
        ) : null;
    };

    const scrollToNavigation = () => {
        const navigationElement = document.getElementById('navigation-section');
        if (navigationElement) {
            navigationElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!aboutData) return null;

    // Smooth animation variants for better UX
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <>
            <style jsx global>{`
                .icon-container {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    line-height: 1 !important;
                }
                .icon-container svg {
                    display: block !important;
                    margin: auto !important;
                    vertical-align: middle !important;
                }
            `}</style>
            
            {/* Background Pattern - Fixed */}
            <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.1)_1px,transparent_0)] bg-[size:40px_40px]"></div>
            </div>

            {/* Hero Section - Full Screen */}
            <section className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950/20 via-black to-emerald-900/20 pt-24">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 md:px-6 text-center relative z-1 flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mb-8"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/30"></div>
                                <div className="absolute inset-1 bg-gradient-to-br from-black to-emerald-950 rounded-full flex items-center justify-center border border-emerald-400/20">
                                    <Image
                                        src={aboutData.companyInfo.logo}
                                        alt={aboutData.companyInfo.name}
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                        >
                            {aboutData.companyInfo.name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12 px-4"
                        >
                            {aboutData.companyInfo.slogan}
                        </motion.p>

                        <div className='flex flex-col items-center justify-center gap-6'>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={scrollToNavigation}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border-2 border-emerald-400/70 hover:border-emerald-300 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-400/50 transition-all duration-300 active:scale-95 backdrop-blur-sm"
                                >
                                    <span className="relative z-1">
                                        Explorar Proyecto
                                    </span>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </motion.div>
                            
                            {/* Scroll Indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="cursor-pointer"
                                onClick={scrollToNavigation}
                            >
                                <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
                                    <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-bounce"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Section */}
            <div id="navigation-section" className="sticky top-24 z-3 bg-gradient-to-r from-emerald-950/95 to-black/95 backdrop-blur-md border-b border-emerald-400/40 shadow-lg">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 ease-out shadow-sm" 
                     style={{ width: `${scrollProgress}%` }}></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 z-4">
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                        {aboutData.sections.map((section: Section, index: number) => (
                            <motion.button
                                key={section.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveSection(section.id)}
                                className={`relative px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                                    activeSection === section.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-400/30'
                                        : 'text-gray-300 hover:text-emerald-300 hover:bg-emerald-950/30 hover:shadow-sm'
                                }`}
                            >
                                <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <span className="w-3 h-3 sm:w-4 sm:h-4 icon-container flex-shrink-0 relative">
                                        <span className="absolute inset-0 icon-container">
                                            {getIcon(section.icon, "w-2.5 h-2.5 sm:w-3.5 sm:h-3.5")}
                                        </span>
                                    </span>
                                    <span className="hidden sm:inline">{section.title}</span>
                                    <span className="sm:hidden">{section.title.split(' ')[0]}</span>
                                </span>
                                {activeSection === section.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg shadow-emerald-400/30"
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections - Each Full Screen */}
            <div className="absolute w-full bg-gradient-to-br from-emerald-950/40 via-black to-emerald-900/30 text-lg overflow-hidden">
                <AnimatePresence mode="wait">
                    {aboutData.sections.map((section: Section) => {
                        if (section.id !== activeSection) return null;

                        return (
                            <motion.section
                                key={section.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="min-h-screen w-full flex items-center justify-center"
                            >
                                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-2">
                                    <div className="flex flex-col justify-center min-h-[80vh] gap-8">
                                        {/* Section Header */}
                                        <div className="text-center mb-8">
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/30 border border-emerald-400/30"
                                            >
                                                <span className="text-white">
                                                    {getIcon(section.icon, "w-8 h-8")}
                                                </span>
                                            </motion.div>
                                            <motion.h2 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.6 }}
                                                className="text-3xl md:text-4xl font-bold text-white"
                                            >
                                                {section.title}
                                            </motion.h2>
                                        </div>

                                        {/* Section Content */}
                                        {section.content.type === 'description' && section.content.description && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6, duration: 0.8 }}
                                                className="max-w-4xl mx-auto overflow-x-hidden"
                                            >
                                                <div className="relative p-8 bg-gradient-to-br from-emerald-900/20 to-emerald-950/40 rounded-2xl border border-emerald-500/20 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20 transition-all duration-500">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-t-2xl"></div>
                                                    <p className="text-lg md:text-xl text-emerald-50 leading-relaxed font-light">
                                                        {section.content.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {section.content.type === 'items' && section.content.items && (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                                {section.content.items.map((item, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 40 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 + (index * 0.15), duration: 0.6 }}
                                                        whileHover={{ y: -8, scale: 1.02 }}
                                                        className="group relative p-6 bg-gradient-to-br from-emerald-900/10 to-emerald-950/30 rounded-2xl border border-emerald-600/20 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-sm"
                                                    >
                                                        {/* Subtle accent line */}
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                                                                <span className="text-white">
                                                                    {getIcon(item.icon, "w-6 h-6")}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-xl font-semibold text-emerald-50 mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-emerald-100/80 leading-relaxed group-hover:text-emerald-100 transition-colors duration-300">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.section>
                        );
                    })}
                </AnimatePresence>
            </div>
        </>
    );
}