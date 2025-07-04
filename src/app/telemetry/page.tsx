'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { 
    ChartBarIcon, 
    CpuChipIcon, 
    DocumentChartBarIcon,
    SignalIcon,
    CogIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import HelpButton from '@/components/common/UI/buttons/HelpButton';
import HelpModal from '@/components/features/modals/HelpModal';

export default function TelemetryPage() {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('telemetry').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black to-[#022510] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-full min-h-screen px-4 md:px-6 lg:py-0 mb-24">
            <div className="w-full max-w-7xl mx-auto lg:w-5/6 xl:w-2/3 min-h-screen text-white">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-16 relative">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6">
                        <div className="w-full h-full bg-emerald-400/20 rounded-full flex items-center justify-center">
                            <ChartBarIcon className="w-12 h-12 md:w-16 md:h-16 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                        {t('telemetry.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto px-4">
                        {t('telemetry.subtitle')}
                    </p>
                    
                    {/* Help Button */}
                    <div className="absolute top-0 right-0">
                        <HelpButton onClick={() => setIsHelpModalOpen(true)} />
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-emerald-400/30 transition-colors duration-300 mb-8">
                    <div className="p-6 md:p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CpuChipIcon className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                            {t('telemetry.comingSoon')}
                        </h2>
                        <p className="text-lg text-white/70 mb-6 max-w-3xl mx-auto">
                            {t('telemetry.description')}
                        </p>
                        <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4 max-w-2xl mx-auto">
                            <p className="text-emerald-300 text-sm">
                                {t('telemetry.features')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Real Time Data */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <SignalIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.realTimeData')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.realTimeDataDesc')}
                        </p>
                    </div>

                    {/* Analytics */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <ChartBarIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.analytics')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.analyticsDesc')}
                        </p>
                    </div>

                    {/* Reports */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <DocumentChartBarIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.reports')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.reportsDesc')}
                        </p>
                    </div>

                    {/* Additional Features */}
                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <CogIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.automation')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.automationDesc')}
                        </p>
                    </div>

                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <EyeIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.monitoring')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.monitoringDesc')}
                        </p>
                    </div>

                    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-emerald-400/30 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors">
                            <CpuChipIcon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                            {t('telemetry.ai')}
                        </h3>
                        <p className="text-white/70 text-sm md:text-base">
                            {t('telemetry.aiDesc')}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Help Modal */}
            <HelpModal 
                isOpen={isHelpModalOpen} 
                onClose={() => setIsHelpModalOpen(false)}
                namespace="telemetry"
                features={[
                    {
                        icon: SignalIcon,
                        title: t('telemetry.realTimeData'),
                        description: t('telemetry.realTimeDataDesc'),
                        details: t('telemetry.realTimeDataDetails')
                    },
                    {
                        icon: ChartBarIcon,
                        title: t('telemetry.analytics'),
                        description: t('telemetry.analyticsDesc'),
                        details: t('telemetry.analyticsDetails')
                    },
                    {
                        icon: DocumentChartBarIcon,
                        title: t('telemetry.reports'),
                        description: t('telemetry.reportsDesc'),
                        details: t('telemetry.reportsDetails')
                    },
                    {
                        icon: CogIcon,
                        title: t('telemetry.automation'),
                        description: t('telemetry.automationDesc'),
                        details: t('telemetry.automationDetails')
                    },
                    {
                        icon: EyeIcon,
                        title: t('telemetry.monitoring'),
                        description: t('telemetry.monitoringDesc'),
                        details: t('telemetry.monitoringDetails')
                    },
                    {
                        icon: CpuChipIcon,
                        title: t('telemetry.ai'),
                        description: t('telemetry.aiDesc'),
                        details: t('telemetry.aiDetails')
                    }
                ]}
                title={t('telemetry.helpTitle')}
                description={t('telemetry.helpDescription')}
                footer={t('telemetry.helpFooter')}
            />
        </div>
    );
} 