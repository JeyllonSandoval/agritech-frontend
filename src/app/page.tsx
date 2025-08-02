'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import * as FaIcons from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import { HiEnvelope } from 'react-icons/hi2';
import { FaCopyright } from 'react-icons/fa';

export default function Home() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const pathname = usePathname();
    const { t, loadTranslations, getNamespace } = useTranslation();
    const { language } = useLanguage();
    const [homeData, setHomeData] = useState<any>(null);

    useEffect(() => {
        loadTranslations('home').then(() => {
            setHomeData(getNamespace());
        });
    }, [language]);

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

    const getIcon = (iconName: string, className: string = "w-6 h-6") => {
        const iconMap: { [key: string]: string } = {
            'document': 'FaFileAlt',
            'chat': 'FaComments',
            'folder': 'FaChartLine',
            'learn': 'FaLightbulb',
            'map': 'FaMap',
            'leaf': 'FaLeaf',
            'farmer': 'FaUsers',
            'student': 'FaGraduationCap',
            'sprout': 'FaSeedling',
            'brain': 'FaBrain',
            'eye': 'FaEye',
            'chart': 'FaChartArea',
            'wifi': 'FaWifi',
            'trending-up': 'FaTrendingUp',
            'droplet': 'FaTint',
            'shield': 'FaShieldAlt',
            'cloud': 'FaCloud',
            'settings': 'FaCog',
            'target': 'FaBullseye',
            'grain': 'FaSeedling',
            'tower': 'FaBroadcastTower',
            'lightbulb': 'FaLightbulb',
            'map-pin': 'FaMapPin'
        };
        
        const IconComponent = (FaIcons as any)[iconMap[iconName]];
        return IconComponent ? <IconComponent className={className} /> : null;
    };

    if (!homeData) return null;

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <main className="absolute inset-0 overflow-y-auto scroll-smooth text-lg">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-emerald-950/30 z-[60]">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 ease-out shadow-sm shadow-emerald-400/20" 
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Background Pattern - Fixed */}
            <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(16,185,129,0.05)_49%,rgba(16,185,129,0.05)_51%,transparent_52%)] bg-[size:60px_60px]"></div>
            </div>

            {/* Hero Section */}
            <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-emerald-950/5 via-black to-black">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-transparent to-emerald-900/30" />
                    
                    {/* Animated Floating Elements */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-blob-1"></div>
                    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-blob-2"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-300/15 rounded-full blur-3xl animate-blob-3"></div>
                    
                    {/* Subtle geometric shapes */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-400/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-300/5 rounded-full"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 text-center relative z-1">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="mb-8"
                        >
                            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-full blur-sm"></div>
                                <div className="absolute inset-1 bg-gradient-to-br from-black to-emerald-950/50 rounded-full flex items-center justify-center border border-emerald-400/20">
                                    <Image
                                        src={homeData.hero.image}
                                        alt="AgriTech Logo"
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                        >
                            {homeData.hero.title}
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 max-w-4xl"
                        >
                            {homeData.hero.subtitle}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="text-lg md:text-xl text-white/70 max-w-5xl mx-auto leading-relaxed mb-12"
                        >
                            {homeData.hero.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link 
                                href="/playground" 
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/30 hover:border-emerald-300 rounded-2xl font-semibold text-white text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-400/25 transition-all duration-300 active:scale-95"
                            >
                                <span>{homeData.hero.buttons?.playground || homeData.hero.buttonPlayground}</span>
                                <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                            
                            <Link 
                                href="/telemetry" 
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-900/20 to-emerald-950/40 hover:from-emerald-800/30 hover:to-emerald-900/50 border border-emerald-600/20 hover:border-emerald-500/40 rounded-2xl font-semibold text-emerald-400 hover:text-emerald-300 text-lg backdrop-blur-sm transition-all duration-300 active:scale-95"
                            >
                                <span>{homeData.hero.buttons?.telemetry || "Ver Telemetría"}</span>
                                {getIcon('chart', 'w-5 h-5')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            {homeData.mission && (
                <section className="py-20 bg-gradient-to-b from-black to-emerald-950/10 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-6">
                                {homeData.mission.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
                                {homeData.mission.description}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        >
                            {homeData.mission.stats.map((stat: any, index: number) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="text-center p-6 bg-gradient-to-br from-emerald-900/10 to-emerald-950/20 rounded-2xl border border-emerald-600/20 backdrop-blur-sm"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                                        {stat.number}
                                    </div>
                                    <p className="text-emerald-100/80">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-emerald-950/10 to-black relative">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
                            {homeData.features.title}
                        </h2>
                        {homeData.features.subtitle && (
                            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
                                {homeData.features.subtitle}
                            </p>
                        )}
                    </motion.div>

                                            <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {homeData.features.items.map((feature: any, index: number) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative p-6 bg-gradient-to-br from-emerald-900/10 to-emerald-950/20 rounded-2xl border border-emerald-600/20 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                                            <span className="text-white">
                                                {getIcon(feature.icon, "w-5 h-5")}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold text-emerald-50 mb-3 group-hover:text-emerald-200 transition-colors duration-300">
                                                {feature.title}
                                            </h3>
                                            <p className="text-emerald-100/80 leading-relaxed group-hover:text-emerald-100 transition-colors duration-300">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                </div>
            </section>

            {/* EcoWitt Section */}
            {homeData.ecowitt && (
                <section className="py-20 bg-gradient-to-b from-black to-emerald-950/10 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
                                {homeData.ecowitt.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-6">
                                {homeData.ecowitt.subtitle}
                            </p>
                            <p className="text-base md:text-lg text-white/60 max-w-4xl mx-auto leading-relaxed mb-4">
                                {homeData.ecowitt.description}
                            </p>
                            <div className="inline-block p-4 max-w-4xl bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                                <p className="text-sm text-emerald-300" dangerouslySetInnerHTML={{ __html: homeData.ecowitt.disclaimer }}></p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                        >
                            {homeData.ecowitt.features.map((feature: any, index: number) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="p-6 bg-gradient-to-br from-emerald-900/10 to-emerald-950/20 rounded-2xl border border-emerald-600/20 text-center"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                                        <span className="text-white">
                                            {getIcon(feature.icon, "w-5 h-5")}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-emerald-50 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-emerald-100/80 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {homeData.ecowitt.models.map((model: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-6 bg-gradient-to-br from-emerald-900/5 to-emerald-950/15 rounded-2xl border border-emerald-600/10"
                                >
                                    <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                                        {model.name}
                                    </h4>
                                    <p className="text-emerald-100/80 mb-3 leading-relaxed">
                                        {model.description}
                                    </p>
                                    <p className="text-sm text-emerald-200/60">
                                        {model.specs}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Audience Section */}
            <section className="py-20 bg-gradient-to-b from-emerald-950/10 to-black relative">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
                            {homeData.audience.title}
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    >
                        {homeData.audience.groups.map((group: any, index: number) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative p-8 bg-gradient-to-br from-emerald-900/10 to-emerald-950/20 rounded-2xl border border-emerald-600/20 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                                        <span className="text-white">
                                            {getIcon(group.icon, "w-6 h-6")}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-emerald-50 mb-4 group-hover:text-emerald-200 transition-colors duration-300">
                                        {group.title}
                                    </h3>
                                </div>
                                
                                <p className="text-emerald-100/80 leading-relaxed mb-6 group-hover:text-emerald-100 transition-colors duration-300">
                                    {group.description}
                                </p>
                                
                                {group.benefits && (
                                    <ul className="space-y-2">
                                        {group.benefits.map((benefit: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-emerald-200/80">
                                                <FaIcons.FaCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Impact Section */}
            {homeData.impact && (
                <section className="py-20 bg-gradient-to-b from-black to-emerald-950/10 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-6">
                                {homeData.impact.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
                                {homeData.impact.description}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {homeData.impact.metrics.map((metric: any, index: number) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="text-center p-6 bg-gradient-to-br from-emerald-900/10 to-emerald-950/20 rounded-2xl border border-emerald-600/20 backdrop-blur-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                                        <span className="text-white">
                                            {getIcon(metric.icon, "w-5 h-5")}
                                        </span>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
                                        {metric.value}
                                    </div>
                                    <h3 className="text-lg font-semibold text-emerald-50 mb-2">
                                        {metric.title}
                                    </h3>
                                    <p className="text-sm text-emerald-100/70">
                                        {metric.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section className="py-20 bg-gradient-to-b from-emerald-950/10 to-emerald-950/30 relative">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-6">
                            {homeData.contact.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {homeData.contact.description}
                        </p>
                        {homeData.contact.cta && (
                            <p className="text-base text-emerald-300 mb-12 font-medium">
                                {homeData.contact.cta}
                            </p>
                        )}
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <a 
                                href={`mailto:${homeData.contact.email}`} 
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-900/20 to-emerald-950/40 hover:from-emerald-800/30 hover:to-emerald-900/50 border border-emerald-600/20 hover:border-emerald-500/40 rounded-2xl text-emerald-400 hover:text-emerald-300 transition-all duration-300 text-lg hover:scale-105 transform backdrop-blur-sm"
                            >
                                <HiEnvelope className="w-5 h-5" />
                                {homeData.contact.email}
                            </a>
                        </motion.div>

                        {homeData.contact.team && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row justify-center items-center gap-8 text-xs"
                            >
                                <div className="text-center">
                                    <h3 className="font-semibold text-emerald-400 mb-2">{homeData.contact.team.title}</h3>
                                    <div className="text-center flex flex-row justify-center items-center gap-2">
                                        <p className="text-emerald-100/80">
                                            <span className="text-emerald-200/60">{homeData.contact.team.description}</span>
                                        </p>
                                        <p className="text-emerald-100/80 flex items-center gap-2">
                                            <FaCopyright className="w-4 h-4 text-emerald-400" />
                                            <span className="text-emerald-200/60">{new Date().getFullYear()} AgriTech. Todos los derechos reservados.</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>
        </main>
    );
}