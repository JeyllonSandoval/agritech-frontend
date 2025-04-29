'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import aboutData from '@/data/about.json';
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

    const getIcon = (iconName: string) => {
        const IconComponent = (FaIcons as any)[iconName];
        return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
    };

    return (
        <div className="w-2/3 min-h-screen text-white mt-24">
            {/* Company Info Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <Image
                        src={aboutData.companyInfo.logo}
                        alt={aboutData.companyInfo.name}
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-white/90">
                    {aboutData.companyInfo.name}
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    {aboutData.companyInfo.slogan}
                </p>
            </motion.div>

            {/* Sections */}
            <div className="w-full mx-auto space-y-6">
                {aboutData.sections.map((section: Section) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-white/10 rounded-xl overflow-hidden"
                    >
                        <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {getIcon(section.icon)}
                                <h2 className="text-2xl font-semibold">{section.title}</h2>
                            </div>
                            <span className="text-2xl transform transition-transform duration-300">
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
                                    <div className="p-6 border-t border-white/10">
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