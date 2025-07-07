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
    EyeIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import HelpButton from '@/components/common/UI/buttons/HelpButton';
import HelpModal from '@/components/features/modals/HelpModal';
import { useTelemetry } from '@/hooks/useTelemetry';
import RealtimeDataDisplay from '@/components/features/telemetry/RealtimeDataDisplay';
import TelemetryStats from '@/components/features/telemetry/TelemetryStats';
import TelemetryControls from '@/components/features/telemetry/TelemetryControls';
import TelemetryAlerts from '@/components/features/telemetry/TelemetryAlerts';

// Dispositivos de ejemplo - en producción esto vendría de una configuración
const SAMPLE_DEVICES = [
  'A4:C1:38:XX:XX:XX', // Dispositivo principal
  'B8:27:EB:XX:XX:XX', // Dispositivo secundario
  'DC:A6:32:XX:XX:XX'  // Dispositivo de respaldo
];

export default function TelemetryPage() {
    const { t, loadTranslations } = useTranslation();
    const { language } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    // Hook de telemetría
    const {
        data: telemetryData,
        loadingState,
        error,
        isRunning,
        stats,
        alerts,
        startMonitoring,
        stopMonitoring,
        refreshData,
        acknowledgeAlert,
        clearError
    } = useTelemetry({
        devices: SAMPLE_DEVICES,
        updateInterval: 30000, // 30 segundos
        autoStart: false, // No iniciar automáticamente
        useMock: showDemo, // Usar mock cuando está en modo demo
        onError: (error) => {
            console.error('Telemetry error:', error);
        },
        onDataUpdate: (data) => {
            console.log('Telemetry data updated:', data);
        }
    });

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

                {/* Demo Mode Toggle */}
                <div className="mb-8">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Modo Demostración
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Activa el modo demostración para ver datos simulados de telemetría
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDemo(!showDemo)}
                                className={`px-6 py-2 text-lg rounded-lg font-medium transition-all duration-200 ${
                                    showDemo
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                                }`}
                            >
                                {showDemo ? 'Desactivar Demo' : 'Activar Demo'}
                            </button>
                        </div>
                    </div>
                </div>

                {showDemo ? (
                    /* Contenido de Telemetría en Tiempo Real */
                    <div className="space-y-8">
                        {/* Controles de Telemetría */}
                        <TelemetryControls
                            isRunning={isRunning}
                            onStart={startMonitoring}
                            onStop={stopMonitoring}
                            onRefresh={refreshData}
                            lastUpdate={telemetryData?.timestamp}
                            updateInterval={30000}
                        />

                        {/* Mensaje de Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
                                    <span className="text-red-400 font-medium">Error:</span>
                                    <span className="text-white ml-2">{error}</span>
                                    <button
                                        onClick={clearError}
                                        className="ml-auto text-white/60 hover:text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Estadísticas */}
                        <TelemetryStats stats={stats} />

                        {/* Alertas */}
                        <TelemetryAlerts
                            alerts={alerts}
                            onAcknowledge={acknowledgeAlert}
                            onDismiss={(alertId) => {
                                // Implementar lógica para descartar alertas
                                console.log('Dismiss alert:', alertId);
                            }}
                        />

                        {/* Datos en Tiempo Real */}
                        {telemetryData && (
                            <RealtimeDataDisplay
                                devices={telemetryData.devices}
                                loadingState={loadingState}
                                lastUpdate={telemetryData.timestamp}
                                onDeviceClick={(device) => {
                                    console.log('Device clicked:', device);
                                    // Aquí podrías abrir un modal con detalles del dispositivo
                                }}
                            />
                        )}

                        {/* Estado de carga inicial */}
                        {loadingState === 'loading' && !telemetryData && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                                <p className="text-white/70">Iniciando monitoreo de sensores...</p>
                            </div>
                        )}

                        {/* Estado sin datos */}
                        {!isRunning && !telemetryData && (
                            <div className="text-center py-12">
                                <SignalIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Monitoreo Detenido
                                </h3>
                                <p className="text-white/70 mb-6 text-lg">
                                    Presiona "Iniciar" para comenzar a monitorear los sensores
                                </p>
                                <button
                                    onClick={startMonitoring}
                                    className="px-6 py-3 text-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-lg hover:bg-emerald-500/30 transition-colors duration-200"
                                >
                                    Iniciar Monitoreo
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Contenido Original - Coming Soon */
                    <div className="space-y-8">
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
                )}
            </div>
            
            {/* Help Modal */}
            <HelpModal 
                isOpen={isHelpModalOpen} 
                onClose={() => setIsHelpModalOpen(false)}
                namespace="telemetry"
                title={t('telemetry.helpTitle')}
                description={t('telemetry.helpDescription')}
                footer={t('telemetry.helpFooter')}
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
            />
        </div>
    );
} 