'use client';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

interface Item {
    title: string;
    icon: string;
    description: string;
}

interface MissionVision {
    title: string;
    icon: string;
    items: string[];
}

interface SectionContentProps {
    content: {
        type: string;
        description?: string;
        items?: Item[];
        mission?: MissionVision;
        vision?: MissionVision;
    };
}

const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const getIcon = (iconName: string) => {
    const IconComponent = (FaIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6 text-emerald-400" /> : null;
};

export default function SectionContent({ content }: SectionContentProps) {
    if (content.type === 'description' && content.description) {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="space-y-4"
            >
                <p className="text-base md:text-lg text-white/80 leading-relaxed tracking-wide">{content.description}</p>
            </motion.div>
        );
    }

    if (content.type === 'items' && content.items) {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
                {content.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl 
                         hover:border-emerald-400/30 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            {getIcon(item.icon)}
                            <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                        </div>
                        <p className="text-base md:text-lg text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">{item.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    if (content.type === 'mission-vision' && content.mission && content.vision) {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl 
                       hover:border-emerald-400/30 transition-colors duration-300"
                >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        {getIcon(content.mission.icon)}
                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{content.mission.title}</h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        {content.mission.items.map((item, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="text-base md:text-lg text-white/70 group-hover:text-white/90 transition-colors"
                            >
                                {item}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl 
                       hover:border-emerald-400/30 transition-colors duration-300"
                >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        {getIcon(content.vision.icon)}
                        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{content.vision.title}</h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                        {content.vision.items.map((item, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="text-base md:text-lg text-white/70 group-hover:text-white/90 transition-colors"
                            >
                                {item}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return null;
} 