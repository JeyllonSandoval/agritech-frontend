// ============================================================================
// TELEMETRY DASHBOARD
// Main component for displaying telemetry data and controls
// ============================================================================

import React, { useState } from 'react';
import { useTelemetry } from '../../../hooks/useTelemetry';
import TelemetryStats from '../../../components/features/telemetry/TelemetryStats';
import DeviceSelector from '../../../components/features/telemetry/DeviceSelector';
import RealtimeDataDisplay from '../../../components/features/telemetry/RealtimeDataDisplay';
import WeatherDataDisplay from '../../../components/features/telemetry/WeatherDataDisplay';
import TelemetryControls from '../../../components/features/telemetry/TelemetryControls';
import TelemetryAlerts from '../../../components/features/telemetry/TelemetryAlerts';
import DeviceInfo from '../../../components/features/telemetry/DeviceInfo';
import DeviceComparison from '../../../components/features/telemetry/DeviceComparison';
import DeviceGroupManager from '../../../components/features/telemetry/DeviceGroupManager';
import TelemetryReports from '../../../components/features/telemetry/TelemetryReports';
import { DeviceInfo as DeviceInfoType } from '../../../types/telemetry';
// Auxiliar para dispositivos con ubicación
type DeviceWithLocation = DeviceInfoType & { location: { latitude: number; longitude: number } };
import HelpButton from '../../common/UI/buttons/HelpButton';
import HelpModal from '../../features/modals/HelpModal';
import { ChartBarIcon, SparklesIcon, DocumentChartBarIcon, Cog6ToothIcon, BellAlertIcon, CpuChipIcon, ScaleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../../hooks/useTranslation';
import telemetryService from '../../../services/telemetryService';

interface TelemetryDashboardProps {
  deviceType?: string;
  autoPoll?: boolean;
  pollInterval?: number;
}

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  deviceType,
  autoPoll = true,
  pollInterval = 30000
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfoType | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const [showDeviceComparison, setShowDeviceComparison] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<null | 'info' | 'weather'>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherDataPanel, setWeatherDataPanel] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Elimina el estado local de deviceCharacteristics

  const {
    // State
    devices,
    realtimeData,
    weatherData,
    deviceInfo,
    deviceCharacteristics,
    groups,
    selectedGroup: globalSelectedGroup,
    loading,
    error,
    polling,
    lastUpdate,
    stats,
    alerts,
    
    // Actions
    fetchDevices,
    selectDevice,
    fetchDeviceInfo,
    fetchDeviceCharacteristics,
    fetchRealtimeData,
    fetchWeatherData,
    fetchGroups,
    selectGroup,
    startPolling,
    stopPolling,
    acknowledgeAlert,
    clearAlerts,
    clearError,
    setLoading,
    setError
  } = useTelemetry({
    deviceType,
    autoPoll,
    pollInterval
  });

  const { t } = useTranslation();
  const telemetryFeatures = [
    {
      icon: ChartBarIcon,
      title: t('telemetry.realTimeData'),
      description: t('telemetry.realTimeDataDesc'),
      details: t('telemetry.realTimeDataDetails')
    },
    {
      icon: SparklesIcon,
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
      icon: Cog6ToothIcon,
      title: t('telemetry.automation'),
      description: t('telemetry.automationDesc'),
      details: t('telemetry.automationDetails')
    },
    {
      icon: BellAlertIcon,
      title: t('telemetry.monitoring'),
      description: t('telemetry.monitoringDesc'),
      details: t('telemetry.monitoringDetails')
    },
    {
      icon: CpuChipIcon,
      title: t('telemetry.ai'),
      description: t('telemetry.aiDesc'),
      details: t('telemetry.aiDetails')
    },
    {
      icon: ScaleIcon,
      title: t('telemetry.comparison'),
      description: t('telemetry.comparisonDesc'),
      details: t('telemetry.comparisonDetails')
    }
  ];

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDeviceSelect = (device: DeviceInfoType | null) => {
    setSelectedDevice(device);
    selectDevice(device);
  };

  const handleGroupSelect = (group: any) => {
    selectGroup(group);
  };

  const handleRefresh = () => {
    if (selectedDevice) {
      fetchRealtimeData(selectedDevice.DeviceID);
      fetchDeviceInfo(selectedDevice.DeviceID);
    }
    fetchDevices();
  };

  const handleTogglePolling = () => {
    if (polling) {
      stopPolling();
    } else {
      startPolling();
    }
  };

  const handleShowDeviceInfo = () => {
    if (selectedDevice) {
      fetchDeviceCharacteristics(selectedDevice.DeviceID);
      if (!deviceInfo) {
        fetchDeviceInfo(selectedDevice.DeviceID);
      }
      setShowDeviceInfo(true);
    }
  };

  const handleHideDeviceInfo = () => {
    setShowDeviceInfo(false);
  };

  const handleShowDeviceComparison = () => {
    setShowDeviceComparison(true);
  };

  const handleHideDeviceComparison = () => {
    setShowDeviceComparison(false);
  };

  const handleShowGroupManager = () => {
    setShowGroupManager(true);
  };

  const handleHideGroupManager = () => {
    setShowGroupManager(false);
  };

  const handleShowReports = () => {
    setShowReports(true);
  };

  const handleHideReports = () => {
    setShowReports(false);
  };

  // Calcular ubicación promedio de un grupo
  const getGroupAverageLocation = (group: any) => {
    if (!group || !group.members || group.members.length === 0) return null;
    const validMembers = group.members.filter((m: any) => m.location && m.location.latitude && m.location.longitude);
    if (validMembers.length === 0) return null;
    const avgLat = validMembers.reduce((sum: number, m: any) => sum + m.location.latitude, 0) / validMembers.length;
    const avgLon = validMembers.reduce((sum: number, m: any) => sum + m.location.longitude, 0) / validMembers.length;
    return { latitude: avgLat, longitude: avgLon };
  };

  // Obtener datos de clima para dispositivo o grupo
  const fetchWeatherPanelData = async (device: DeviceInfoType | null, group: any | null) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      let lat: number | null = null;
      let lon: number | null = null;
      // Adaptado para usar latitude y longitude directamente del deviceInfo
      if (device && deviceInfo?.latitude && deviceInfo?.longitude) {
        lat = deviceInfo.latitude;
        lon = deviceInfo.longitude;
      } else if (group) {
        const avgLoc = getGroupAverageLocation(group);
        if (avgLoc) {
          lat = avgLoc.latitude;
          lon = avgLoc.longitude;
        }
      }
      if (lat == null || lon == null) {
        setWeatherError('No se pudo determinar la ubicación para obtener el clima.');
        setWeatherDataPanel(null);
        setWeatherLoading(false);
        return;
      }
      // Usar el servicio de telemetría en lugar de llamada directa
      const response = await telemetryService.getCurrentWeather(lat, lon, 'metric', 'es');
      if (!response.success) {
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join('; ') 
          : response.error || 'Error al obtener datos de clima';
        throw new Error(errorMessage);
      }
      setWeatherDataPanel(response.data);
    } catch (err: any) {
      setWeatherError(err.message || 'Error al obtener datos de clima');
      setWeatherDataPanel(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Handler para selección
  const handleWeatherDeviceSelect = (device: DeviceInfoType | null) => {
    setSelectedDevice(device);
    setSelectedGroup(null);
    // Llamar a selectDevice para que el hook obtenga deviceInfo y weatherData
    selectDevice(device);
    // También obtener deviceInfo si no está disponible
    if (device && !deviceInfo) {
      fetchDeviceInfo(device.DeviceID);
    }
    fetchWeatherPanelData(device, null);
  };
  
  const handleWeatherGroupSelect = (group: any) => {
    setSelectedGroup(group);
    setSelectedDevice(null);
    // Llamar a selectGroup para que el hook maneje la selección
    selectGroup(group);
    fetchWeatherPanelData(null, group);
  };
  
  const handleWeatherRefresh = () => {
    fetchWeatherPanelData(selectedDevice, selectedGroup);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className=" p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 flex items-center gap-3">
                Telemetría AgriTech
                <HelpButton onClick={() => setIsHelpModalOpen(true)} title="Ayuda sobre Telemetría" />
              </h1>
            </div>
            <p className="text-sm md:text-base text-white/70">
              Monitoreo en tiempo real de sensores EcoWitt y datos meteorológicos
            </p>
          </div>
        </div>
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          namespace="telemetry"
          features={telemetryFeatures}
          title={t('telemetry.helpTitle')}
          description={t('telemetry.helpDescription')}
        />

        {/* Stats Overview */}
        <TelemetryStats stats={{
          totalDevices: stats.totalDevices,
          activeDevices: stats.activeDevices,
          totalGroups: stats.totalGroups,
          lastUpdate: lastUpdate
        }} />


        <TelemetryControls
              polling={polling}
              loading={loading}
              onTogglePolling={handleTogglePolling}
              onRefresh={handleRefresh}
              onShowDeviceInfo={handleShowDeviceInfo}
              onShowDeviceComparison={handleShowDeviceComparison}
              onShowGroupManager={handleShowGroupManager}
              onShowReports={handleShowReports}
              selectedDevice={selectedDevice}
              onShowInfoPanel={() => setActivePanel('info')}
              onShowWeatherPanel={() => setActivePanel('weather')}
              devices={devices}
            />
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <TelemetryAlerts 
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
            onClear={clearAlerts}
          />
        )}

        {/* Main Content Grid - Panel informativo condicional */}
        {activePanel === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Device Selection & Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Dispositivos
                  </h2>
                  <button onClick={() => setActivePanel(null)} className="text-white/60 hover:text-red-400 transition-colors p-1 ml-2" title="Cerrar panel informativo">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <DeviceSelector
                  devices={devices}
                  groups={groups}
                  selectedDevice={selectedDevice}
                  selectedGroup={selectedGroup}
                  onDeviceSelect={handleDeviceSelect}
                  onGroupSelect={handleGroupSelect}
                  loading={loading}
                />
              </div>
            </div>
            {/* Right Column - Data Displays */}
            <div className="lg:col-span-2 space-y-6">
              {/* Realtime Data */}
              {selectedDevice && (
                <RealtimeDataDisplay
                  data={realtimeData}
                  deviceName={selectedDevice.DeviceName}
                  loading={loading}
                />
              )}
              {/* Weather Data */}
              {selectedDevice && weatherData && (
                <WeatherDataDisplay
                  device={selectedDevice}
                  weatherData={weatherData}
                  loading={loading}
                  onRefresh={() => {
                    if (selectedDevice && deviceInfo?.latitude && deviceInfo?.longitude) {
                      fetchWeatherData(deviceInfo.latitude, deviceInfo.longitude);
                    }
                  }}
                />
              )}
              {/* No Device Selected */}
              {!selectedDevice && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white mb-2">Selecciona un Dispositivo</h3>
                    <p className="text-white/60 text-sm">
                      Selecciona un dispositivo de la lista para ver sus datos en tiempo real
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Panel Climático avanzado */}
        {activePanel === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selector de dispositivo/grupo */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Dispositivos
                  </h2>
                  <button onClick={() => setActivePanel(null)} className="text-white/60 hover:text-red-400 transition-colors p-1 ml-2" title="Cerrar panel climático">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <DeviceSelector
                  devices={devices}
                  groups={groups}
                  selectedDevice={selectedDevice}
                  selectedGroup={selectedGroup}
                  onDeviceSelect={handleWeatherDeviceSelect}
                  onGroupSelect={handleWeatherGroupSelect}
                  loading={loading}
                />
              </div>
            </div>
            {/* Panel de datos climáticos */}
            <div className="lg:col-span-2 space-y-6">
              {weatherLoading && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-3 text-white/70 text-sm">Cargando clima...</span>
                </div>
              )}
              {weatherError && (
                <div className="text-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm text-red-300">
                  {weatherError}
                </div>
              )}
              {!weatherLoading && !weatherDataPanel && !weatherError && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white mb-2">Selecciona un dispositivo o grupo</h3>
                    <p className="text-white/60 text-sm">
                      Selecciona un dispositivo o grupo de la lista para ver el pronóstico climático completo
                    </p>
                  </div>
                </div>
              )}
              {weatherDataPanel && (() => {
                let device: DeviceWithLocation | undefined;
                // Adaptado para usar latitude y longitude directamente del deviceInfo
                if (selectedDevice && deviceInfo?.latitude && deviceInfo?.longitude) {
                  device = {
                    DeviceID: selectedDevice.DeviceID,
                    DeviceName: selectedDevice.DeviceName,
                    DeviceMac: selectedDevice.DeviceMac,
                    DeviceType: selectedDevice.DeviceType,
                    UserID: selectedDevice.UserID,
                    status: selectedDevice.status,
                    createdAt: selectedDevice.createdAt,
                    location: {
                      latitude: deviceInfo.latitude,
                      longitude: deviceInfo.longitude
                    }
                  };
                } else if (selectedGroup) {
                  const avgLoc = getGroupAverageLocation(selectedGroup);
                  device = {
                    DeviceID: 'group',
                    DeviceName: selectedGroup.GroupName || 'Grupo',
                    DeviceMac: '',
                    DeviceType: 'Outdoor',
                    UserID: '',
                    status: 'active',
                    createdAt: '',
                    location: avgLoc || { latitude: 0, longitude: 0 }
                  };
                }
                if (!device) return null;
                return (
                  <WeatherDataDisplay
                    weatherData={weatherDataPanel}
                    device={device}
                    loading={weatherLoading}
                    onRefresh={handleWeatherRefresh}
                  />
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Device Info Modal */}
      {showDeviceInfo && selectedDevice && (
        <DeviceInfo
          device={selectedDevice}
          deviceInfo={deviceInfo}
          deviceCharacteristics={deviceCharacteristics}
          onClose={handleHideDeviceInfo}
          loading={loading || !deviceCharacteristics}
        />
      )}

      {/* Device Comparison Modal */}
      {showDeviceComparison && (
        <DeviceComparison
          devices={devices}
          onClose={handleHideDeviceComparison}
        />
      )}

      {/* Device Group Manager Modal */}
      {showGroupManager && (
        <DeviceGroupManager
          devices={devices}
          groups={groups}
          onClose={handleHideGroupManager}
          onGroupCreated={(group) => {
            // Refresh groups after creation
            fetchGroups();
          }}
          onGroupUpdated={(group) => {
            // Refresh groups after update
            fetchGroups();
          }}
          onGroupDeleted={(groupId) => {
            // Refresh groups after deletion
            fetchGroups();
          }}
        />
      )}

      {/* Telemetry Reports Modal */}
      {showReports && (
        <TelemetryReports
          devices={devices}
          selectedDevice={selectedDevice}
          onClose={handleHideReports}
        />
      )}
    </div>
  );
};

export default TelemetryDashboard; 