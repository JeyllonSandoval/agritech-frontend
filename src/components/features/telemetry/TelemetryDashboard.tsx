// ============================================================================
// TELEMETRY DASHBOARD
// Main component for displaying telemetry data and controls
// ============================================================================

import React, { useState, useEffect } from 'react';
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

import GroupRealtimeDataDisplay from '../../../components/features/telemetry/GroupRealtimeDataDisplay';
import SimpleWeatherDisplay from '../../../components/features/telemetry/SimpleWeatherDisplay';
import { DeviceInfo as DeviceInfoType } from '../../../types/telemetry';
import { useDeviceWeather } from '../../../hooks/useDeviceWeather';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  ChartBarIcon,
  SparklesIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  CpuChipIcon,
  ScaleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import HelpButton from '../../common/UI/buttons/HelpButton';
import HelpModal from '../../features/modals/HelpModal';
import telemetryService from '../../../services/telemetryService';
import DeviceManager from './DeviceManager';

// Auxiliar para dispositivos con ubicación
type DeviceWithLocation = DeviceInfoType & { location: { latitude: number; longitude: number } };

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
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const [showDeviceComparison, setShowDeviceComparison] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<null | 'info' | 'weather'>(null);

  // Función wrapper para rastrear cambios en activePanel
  const setActivePanelWithLog = (panel: null | 'info' | 'weather') => {
    console.log('🔍 [DASHBOARD] Panel changing from', activePanel, 'to', panel);
    setActivePanel(panel);
  };
  // Removed unused weather panel state variables since we're using hooks now
  const [showDeviceManager, setShowDeviceManager] = useState(false);

  // Elimina el estado local de deviceCharacteristics

  const {
    // State
    devices,
    realtimeData,
    weatherData,
    deviceInfo,
    deviceCharacteristics,
    groups,
    selectedDevice,
    selectedGroup,
    loading,
    error,
    polling,
    lastUpdate,
    stats,
    alerts,
    groupRealtimeData,
    groupDevicesInfo,
    groupDevicesCharacteristics,
    // NUEVO: estado de carga automática
    autoLoadComplete,
    autoLoadProgress,
    
    // Actions
    fetchDevices,
    selectDevice,
    fetchDeviceInfo,
    fetchDeviceCharacteristics,
    fetchRealtimeData,
    fetchWeatherData,
    fetchGroups,
    selectGroup,
    fetchGroupWeatherData,
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

  // Hook centralizado para clima - solo activo según la selección
  const {
    weatherData: basicWeatherData,
    loading: weatherLoadingBasic,
    error: weatherErrorBasic,
    refresh: refreshWeatherBasic
  } = useDeviceWeather({
    device: selectedDevice,
    deviceInfo,
    deviceCharacteristics,
    group: undefined
  });

  // Hook centralizado para clima del grupo - solo activo cuando no hay dispositivo seleccionado
  const {
    weatherData: groupWeatherData,
    loading: groupWeatherLoading,
    error: groupWeatherError,
    refresh: refreshGroupWeather
  } = useDeviceWeather({
    device: null,
    deviceInfo: null,
    deviceCharacteristics: null,
    group: selectedGroup && !selectedDevice ? selectedGroup : null, // Solo activo si no hay dispositivo seleccionado
    groupDevicesCharacteristics
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
    console.log('🔍 [DASHBOARD] Device selected:', device?.DeviceName);
    selectDevice(device);
    
    // NUNCA cerrar el panel automáticamente
    // Solo abrir el panel si no hay uno activo
    if (activePanel === null) {
      setActivePanelWithLog('info');
    }
  };

  const handleGroupSelect = (group: any) => {
    console.log('🔍 [DASHBOARD] Group selected:', group?.GroupName);
    selectGroup(group);
    
    // NUNCA cerrar el panel automáticamente
    // Solo abrir el panel si no hay uno activo
    if (activePanel === null) {
      setActivePanelWithLog('info');
    }
  };

  // Refrescar solo datos del panel derecho
  const handleRefresh = () => {
    if (selectedDevice) {
      Promise.all([
        fetchRealtimeData(selectedDevice.DeviceID),
        fetchDeviceInfo(selectedDevice.DeviceID)
      ]);
    }
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



  const handleShowDeviceManager = () => {
    setShowDeviceManager(true);
  };

  const handleHideDeviceManager = () => {
    setShowDeviceManager(false);
  };

  const handleShowHelp = () => {
    setIsHelpModalOpen(true);
  };

  const handleHideHelp = () => {
    setIsHelpModalOpen(false);
  };

  // Calcular ubicación promedio de un grupo
  const getGroupAverageLocation = (group: any) => {
    console.log('🔍 [TelemetryDashboard] getGroupAverageLocation called for group:', group?.GroupName);
    console.log('🔍 [TelemetryDashboard] groupDevicesCharacteristics:', groupDevicesCharacteristics);
    
    if (!group) return null;
    
    const validLocations: Array<{lat: number, lon: number}> = [];

    // Buscar ubicaciones SOLO en groupDevicesCharacteristics
    Object.values(groupDevicesCharacteristics).forEach((characteristics: any) => {
      const ecoWittData = characteristics?.ecowittInfo?.data;
      console.log('🔍 [TelemetryDashboard] Checking characteristics:', characteristics.deviceId, 'ecowittData:', ecoWittData);
      if (ecoWittData?.latitude && ecoWittData?.longitude && 
          typeof ecoWittData.latitude === 'number' && typeof ecoWittData.longitude === 'number' &&
          !isNaN(ecoWittData.latitude) && !isNaN(ecoWittData.longitude)) {
        validLocations.push({ 
          lat: ecoWittData.latitude, 
          lon: ecoWittData.longitude 
        });
        console.log('🔍 [TelemetryDashboard] Added location from characteristics:', { lat: ecoWittData.latitude, lon: ecoWittData.longitude });
      }
    });

    if (validLocations.length === 0) {
      console.log('🔍 [TelemetryDashboard] No valid locations found in characteristics');
      return null;
    }

    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
    const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;

    console.log('🔍 [TelemetryDashboard] Average location calculated:', { avgLat, avgLon });
    console.log('🔍 [TelemetryDashboard] Valid locations found:', validLocations.length);

    return { latitude: avgLat, longitude: avgLon };
  };

  // Simplified weather panel handlers using hooks
  const handleWeatherDeviceSelect = (device: DeviceInfoType | null) => {
    console.log('🔍 [DASHBOARD] Weather device selected:', device?.DeviceName);
    selectDevice(device);
    if (device && !deviceInfo) {
      fetchDeviceInfo(device.DeviceID);
    }
    if (device) {
      fetchDeviceCharacteristics(device.DeviceID);
    }
    // NUNCA cerrar el panel automáticamente
  };
  
  const handleWeatherGroupSelect = (group: any) => {
    console.log('🔍 [DASHBOARD] Weather group selected:', group?.GroupName);
    selectGroup(group);
    // NUNCA cerrar el panel automáticamente
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
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

          {/* Panel principal de operaciones */}
          <TelemetryControls
            polling={polling}
            loading={loading}
            onTogglePolling={handleTogglePolling}
            onRefresh={handleRefresh}
            onShowDeviceInfo={handleShowDeviceInfo}
            onShowDeviceComparison={handleShowDeviceComparison}
            onShowGroupManager={handleShowGroupManager}
            onShowDevices={handleShowDeviceManager}
            selectedDevice={selectedDevice}
                                onShowInfoPanel={() => setActivePanelWithLog('info')}
                    onShowWeatherPanel={() => setActivePanelWithLog('weather')}
            devices={devices}
            groups={groups}
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
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Dispositivos
                    </h2>
                    <button onClick={() => setActivePanelWithLog(null)} className="text-white/60 hover:text-red-400 transition-colors p-1 ml-2" title="Cerrar panel informativo">
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
                    loading={false} // Nunca loading para el panel izquierdo
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
                    onShowDeviceInfo={handleShowDeviceInfo}
                    device={selectedDevice}
                    deviceInfo={deviceInfo}
                    deviceCharacteristics={deviceCharacteristics}
                  />
                )}
                {/* Group Realtime Data */}
                {selectedGroup && (
                  <GroupRealtimeDataDisplay
                    data={groupRealtimeData}
                    group={selectedGroup}
                    loading={loading}
                    weatherData={weatherData}
                    groupDevicesCharacteristics={groupDevicesCharacteristics}
                  />
                )}
                {/* Weather Data for Individual Devices */}
                {selectedDevice && (
                  <WeatherDataDisplay
                    device={selectedDevice}
                    weatherData={weatherData}
                    loading={weatherLoadingBasic}
                    error={weatherErrorBasic}
                    onRefresh={() => {
                      if (selectedDevice && deviceInfo?.latitude && deviceInfo?.longitude) {
                        fetchWeatherData(deviceInfo.latitude, deviceInfo.longitude);
                      }
                    }}
                  />
                )}
                {/* Simple Weather Display for Groups */}
                {selectedGroup && weatherData && (
                  <SimpleWeatherDisplay
                    weatherData={weatherData}
                    variant="realtime"
                    className="mt-6"
                    onRefresh={() => {
                      if (selectedGroup) {
                        fetchGroupWeatherData(selectedGroup.DeviceGroupID);
                      }
                    }}
                  />
                )}
                {/* No Device or Group Selected */}
                {!selectedDevice && !selectedGroup && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white mb-2">Selecciona un Dispositivo o Grupo</h3>
                      <p className="text-white/60 text-sm">
                        Selecciona un dispositivo o grupo de la lista para ver sus datos en tiempo real
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contenido por defecto cuando no hay panel activo */}
          {activePanel === null && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="text-center">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Panel de Telemetría</h3>
                <p className="text-white/60 text-sm mb-4">
                  Selecciona "Panel informativo" o "Panel Climático" desde los controles para comenzar
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setActivePanelWithLog('info')}
                    className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all duration-200 rounded-lg px-6 py-2 text-sm"
                  >
                    Panel Informativo
                  </button>
                  <button 
                    onClick={() => setActivePanelWithLog('weather')}
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 rounded-lg px-6 py-2 text-sm"
                  >
                    Panel Climático
                  </button>
                </div>
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
                    <button onClick={() => setActivePanelWithLog(null)} className="text-white/60 hover:text-red-400 transition-colors p-1 ml-2" title="Cerrar panel climático">
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
                    loading={false} // Nunca loading para el panel climático
                  />
                </div>
              </div>
              {/* Panel de datos climáticos */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mensaje cuando no hay dispositivo seleccionado */}
                {!selectedDevice && !selectedGroup && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-blue-400/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white mb-2">Selecciona un Dispositivo o Grupo</h3>
                      <p className="text-white/60 text-sm">
                        Selecciona un dispositivo o grupo de la lista para ver los datos climáticos
                      </p>
                    </div>
                  </div>
                )}

                {/* Weather data for individual device */}
                {selectedDevice && !selectedGroup && basicWeatherData && !weatherLoadingBasic && (
                  (() => {
                    let latitude = deviceInfo?.latitude;
                    let longitude = deviceInfo?.longitude;
                    // Si no hay en deviceInfo, usa deviceCharacteristics
                    if (
                      (latitude == null || longitude == null) &&
                      deviceCharacteristics?.ecowittInfo?.data &&
                      typeof deviceCharacteristics.ecowittInfo.data.latitude === 'number' &&
                      typeof deviceCharacteristics.ecowittInfo.data.longitude === 'number'
                    ) {
                      latitude = deviceCharacteristics.ecowittInfo.data.latitude;
                      longitude = deviceCharacteristics.ecowittInfo.data.longitude;
                    }
                    
                    if (latitude != null && longitude != null) {
                      const device: DeviceWithLocation = {
                        DeviceID: selectedDevice.DeviceID,
                        DeviceName: selectedDevice.DeviceName,
                        DeviceMac: selectedDevice.DeviceMac,
                        DeviceType: selectedDevice.DeviceType,
                        UserID: selectedDevice.UserID,
                        status: selectedDevice.status,
                        createdAt: selectedDevice.createdAt,
                        location: { latitude, longitude }
                      };
                      
                      return (
                        <WeatherDataDisplay
                          weatherData={basicWeatherData}
                          device={device}
                          loading={weatherLoadingBasic}
                          onRefresh={refreshWeatherBasic}
                        />
                      );
                    }
                    return null;
                  })()
                )}

                {/* Weather data for group */}
                {selectedGroup && !selectedDevice && groupWeatherData && !groupWeatherLoading && (
                  (() => {
                    const avgLoc = getGroupAverageLocation(selectedGroup);
                    if (avgLoc) {
                      const device: DeviceWithLocation = {
                        DeviceID: 'group',
                        DeviceName: selectedGroup.GroupName || 'Grupo',
                        DeviceMac: '',
                        DeviceType: 'Outdoor',
                        UserID: '',
                        status: 'active',
                        createdAt: '',
                        location: avgLoc
                      };
                      
                      return (
                        <WeatherDataDisplay
                          weatherData={groupWeatherData}
                          device={device}
                          loading={groupWeatherLoading}
                          onRefresh={refreshGroupWeather}
                        />
                      );
                    }
                    return null;
                  })()
                )}
              </div>
            </div>
          )}

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


          {showDeviceManager && (
            <DeviceManager
              onClose={handleHideDeviceManager}
              onDeviceCreated={fetchDevices}
              onDeviceUpdated={fetchDevices}
              onDeviceDeleted={fetchDevices}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TelemetryDashboard; 