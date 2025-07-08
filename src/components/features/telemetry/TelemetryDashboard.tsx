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
import { DeviceInfo as DeviceInfoType } from '../../../types/telemetry';

interface TelemetryDashboardProps {
  userId?: string;
  deviceType?: string;
  autoPoll?: boolean;
  pollInterval?: number;
}

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  userId,
  deviceType,
  autoPoll = true,
  pollInterval = 30000
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfoType | null>(null);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);

  const {
    // State
    devices,
    realtimeData,
    weatherData,
    deviceInfo,
    deviceCharacteristics,
    groups,
    selectedGroup,
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
    userId,
    deviceType,
    autoPoll,
    pollInterval
  });

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
    if (selectedDevice && !deviceInfo) {
      fetchDeviceInfo(selectedDevice.DeviceID);
    }
    if (selectedDevice && !deviceCharacteristics) {
      fetchDeviceCharacteristics(selectedDevice.DeviceID);
    }
    setShowDeviceInfo(true);
  };

  const handleHideDeviceInfo = () => {
    setShowDeviceInfo(false);
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
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 flex items-center gap-3">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Telemetría AgriTech
              </h1>
              <p className="text-sm md:text-base text-white/70">
                Monitoreo en tiempo real de sensores EcoWitt y datos meteorológicos
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${polling ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-white/70">
                  {polling ? 'Actualizando' : 'Pausado'}
                </span>
              </div>
              
              {lastUpdate && (
                <div className="text-sm text-white/50">
                  Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <TelemetryStats stats={{
          totalDevices: stats.totalDevices,
          activeDevices: stats.activeDevices,
          totalGroups: stats.totalGroups,
          lastUpdate: lastUpdate
        }} />

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Device Selection & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Device Selector */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Dispositivos
              </h2>
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

            {/* Controls */}
            <TelemetryControls
              polling={polling}
              loading={loading}
              onTogglePolling={handleTogglePolling}
              onRefresh={handleRefresh}
              onShowDeviceInfo={handleShowDeviceInfo}
              selectedDevice={selectedDevice}
            />
          </div>

          {/* Right Column - Data Displays */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Realtime Data */}
            {selectedDevice && (
              <RealtimeDataDisplay
                device={selectedDevice}
                data={realtimeData}
                loading={loading}
                onRefresh={() => selectedDevice && fetchRealtimeData(selectedDevice.DeviceID)}
              />
            )}

            {/* Weather Data */}
            {selectedDevice && weatherData && (
              <WeatherDataDisplay
                device={selectedDevice}
                weatherData={weatherData}
                loading={loading}
                onRefresh={() => {
                  if (selectedDevice && deviceInfo?.location) {
                    fetchWeatherData(deviceInfo.location.latitude, deviceInfo.location.longitude);
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
      </div>

      {/* Device Info Modal */}
      {showDeviceInfo && selectedDevice && (
        <DeviceInfo
          device={selectedDevice}
          deviceInfo={deviceInfo}
          deviceCharacteristics={deviceCharacteristics}
          onClose={handleHideDeviceInfo}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TelemetryDashboard; 