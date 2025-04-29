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

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const getIcon = (iconName: string) => {
    const IconComponent = (FaIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
};

export default function SectionContent({ content }: SectionContentProps) {
    if (content.type === 'description' && content.description) {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUp}
                className="p-6 border border-white/10 rounded-xl hover:border-emerald-400/30 transition-all duration-300"
            >
                <p className="text-xl text-white/70 leading-relaxed ">{content.description}</p>
            </motion.div>
        );
    }

    if (content.type === 'items' && content.items) {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {content.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 border border-white/10 rounded-xl 
                     hover:border-emerald-400/30 transition-all duration-300
                     hover:transform hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {getIcon(item.icon)}
                            <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                        </div>
                        <p className="text-xl text-white/70 group-hover:text-white/90 transition-colors">{item.description}</p>
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
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group p-6 border border-white/10 rounded-xl 
                   hover:border-emerald-400/30 transition-all duration-300"
                >
                    <div className="flex items-center gap-3 mb-4">
                        {getIcon(content.mission.icon)}
                        <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{content.mission.title}</h3>
                    </div>
                    <div className="space-y-3">
                        {content.mission.items.map((item, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="text-xl text-white/70 group-hover:text-white/90 transition-colors"
                            >
                                {item}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group p-6 border border-white/10 rounded-xl 
                   hover:border-emerald-400/30 transition-all duration-300"
                >
                    <div className="flex items-center gap-3 mb-4">
                        {getIcon(content.vision.icon)}
                        <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{content.vision.title}</h3>
                    </div>
                    <div className="space-y-3">
                        {content.vision.items.map((item, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="text-xl text-white/70 group-hover:text-white/90 transition-colors"
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