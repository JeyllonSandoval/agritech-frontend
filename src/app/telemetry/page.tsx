'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';

export default function TelemetryPage() {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations('telemetry').then(() => setIsLoaded(true));
    }, [language]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                            {t('telemetry.title')}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t('telemetry.subtitle')}
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg 
                                    className="w-12 h-12 text-emerald-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {t('telemetry.comingSoon')}
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                {t('telemetry.description')}
                            </p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <p className="text-emerald-800 text-sm">
                                    {t('telemetry.features')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features Preview */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {t('telemetry.realTimeData')}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {t('telemetry.realTimeDataDesc')}
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {t('telemetry.analytics')}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {t('telemetry.analyticsDesc')}
                            </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2zM10 7h10V5H10v2zM10 11h10V9H10v2zM10 15h10v-2H10v2zM10 19h10v-2H10v2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {t('telemetry.reports')}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {t('telemetry.reportsDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 