// ============================================================================
// DEVICE COMPARISON COMPONENT
// Component for comparing multiple devices data
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, RealtimeData, HistoricalResponse, TimeRange } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChartBarIcon, ClockIcon, EyeIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DeviceComparisonProps {
  devices: DeviceInfo[];
  onClose?: () => void;
}

interface ComparisonData {
  deviceId: string;
  deviceName: string;
  realtimeData?: RealtimeData;
  historicalData?: HistoricalResponse;
  error?: string;
}

const DeviceComparison: React.FC<DeviceComparisonProps> = ({ devices, onClose }) => {
  const { t } = useTranslation();
  const [selectedDevices, setSelectedDevices] = useState<DeviceInfo[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('one_day');
  const [viewMode, setViewMode] = useState<'realtime' | 'historical'>('realtime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRangeInfo, setTimeRangeInfo] = useState<{ startTime: string; endTime: string } | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  // Limpiar datos cuando cambia el modo de vista
  useEffect(() => {
    setComparisonData([]);
    setTimeRangeInfo(null);
    setError(null);
  }, [viewMode]);

  const handleDeviceToggle = (device: DeviceInfo) => {
    setSelectedDevices(prev => {
      const isSelected = prev.some(d => d.DeviceID === device.DeviceID);
      if (isSelected) {
        return prev.filter(d => d.DeviceID !== device.DeviceID);
      } else {
        if (prev.length >= 4) {
          setError('Máximo 4 dispositivos para comparar');
          return prev;
        }
        return [...prev, device];
      }
    });
    setError(null);
  };

  const handleCompareRealtime = async () => {
    if (selectedDevices.length < 2) {
      setError('Selecciona al menos 2 dispositivos para comparar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceIds = selectedDevices.map(d => d.DeviceID);
      const response = await telemetryService.compareDevicesRealtime(deviceIds);
      
      if (response.success && response.data) {
        // El backend devuelve { timestamp, devices: [{ id, name, type, data }] }
        const data: ComparisonData[] = selectedDevices.map(device => {
          const deviceData = response.data.devices.find((d: any) => d.id === device.DeviceID);
          return {
            deviceId: device.DeviceID,
            deviceName: device.DeviceName,
            realtimeData: deviceData?.data || null,
            error: deviceData ? undefined : 'No se encontraron datos para este dispositivo'
          };
        });
        setComparisonData(data);
      } else {
        setError('Error al obtener datos de comparación');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareHistorical = async () => {
    if (selectedDevices.length < 2) {
      setError('Selecciona al menos 2 dispositivos para comparar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceIds = selectedDevices.map(d => d.DeviceID);
      const response = await telemetryService.compareDevicesHistory(deviceIds, timeRange);
      
      if (response.success && response.data) {
        // El backend devuelve { timeRange: { startTime, endTime }, devices: [{ id, name, type, data }] }
        setTimeRangeInfo(response.data.timeRange);
        const data: ComparisonData[] = selectedDevices.map(device => {
          const deviceData = response.data.devices.find((d: any) => d.id === device.DeviceID);
          return {
            deviceId: device.DeviceID,
            deviceName: device.DeviceName,
            historicalData: deviceData?.data || null,
            error: deviceData ? undefined : 'No se encontraron datos para este dispositivo'
          };
        });
        setComparisonData(data);
      } else {
        setError('Error al obtener datos históricos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = () => {
    if (viewMode === 'realtime') {
      handleCompareRealtime();
    } else {
      handleCompareHistorical();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mt-10 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">
            Comparación de Dispositivos
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Device Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Seleccionar Dispositivos ({selectedDevices.length}/4)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.map(device => {
            const isSelected = selectedDevices.some(d => d.DeviceID === device.DeviceID);
            return (
              <button
                key={device.DeviceID}
                onClick={() => handleDeviceToggle(device)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                <div className="text-left">
                  <h4 className="font-medium text-lg">{device.DeviceName}</h4>
                  <p className="text-sm opacity-70">{device.DeviceType}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('realtime')}
            className={`flex items-center text-lg gap-2 px-3 py-2 rounded-lg transition-all ${
              viewMode === 'realtime'
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            Tiempo Real
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`flex items-center text-lg gap-2 px-3 py-2 rounded-lg transition-all ${
              viewMode === 'historical'
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            Histórico
          </button>
        </div>

        {/* Time Range (for historical) */}
        {viewMode === 'historical' && (
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 text-lg rounded-lg bg-white/5 text-emerald-400 border border-white/20 focus:border-emerald-400 focus:outline-none"
          >
            <option value="one_hour" className="text-lg bg-black text-emerald-600">1 Hora</option>
            <option value="one_day" className="text-lg bg-black text-emerald-600">1 Día</option>
            <option value="one_week" className="text-lg bg-black text-emerald-600">1 Semana</option>
            <option value="one_month" className="text-lg bg-black text-emerald-600">1 Mes</option>
            <option value="three_months" className="text-lg bg-black text-emerald-600">3 Meses</option>
          </select>
        )}

        {/* Compare Button */}
        <button
          onClick={handleCompare}
          disabled={selectedDevices.length < 2 || loading}
          className="flex items-center text-lg gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all"
        >
          <Cog6ToothIcon className="w-4 h-4" />
          {loading ? 'Comparando...' : 'Comparar'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 text-lg bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white text-center">
            Resultados de Comparación
          </h3>
          {viewMode === 'historical' && timeRangeInfo && (
            <div className="text-center text-sm text-white/60 bg-white/5 rounded-lg p-2">
              Período: {new Date(timeRangeInfo.startTime).toLocaleDateString()} - {new Date(timeRangeInfo.endTime).toLocaleDateString()}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {comparisonData.map((data) => (
              <div
                key={data.deviceId}
                className="bg-white/5 border border-white/20 rounded-lg p-4"
              >
                <h4 className="font-medium text-white mb-3">{data.deviceName}</h4>
                
                {data.error ? (
                  <p className="text-red-400 text-sm">{data.error}</p>
                ) : viewMode === 'realtime' && data.realtimeData ? (
                  <div className="space-y-2">
                    {data.realtimeData.indoor && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Temperatura:</span>
                        <span className="text-white">
                          {data.realtimeData.indoor.temperature?.value} {data.realtimeData.indoor.temperature?.unit}
                        </span>
                      </div>
                    )}
                    {data.realtimeData.indoor && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Humedad:</span>
                        <span className="text-white">
                          {data.realtimeData.indoor.humidity?.value} {data.realtimeData.indoor.humidity?.unit}
                        </span>
                      </div>
                    )}
                    {data.realtimeData.pressure && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Presión:</span>
                        <span className="text-white">
                          {data.realtimeData.pressure.relative?.value} {data.realtimeData.pressure.relative?.unit}
                        </span>
                      </div>
                    )}
                  </div>
                ) : viewMode === 'historical' && data.historicalData ? (
                  <div className="space-y-2">
                    {data.historicalData.indoor?.temperature && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Temp. Promedio:</span>
                        <span className="text-white">
                          {data.historicalData.indoor.temperature.unit}
                        </span>
                      </div>
                    )}
                    {data.historicalData.indoor?.humidity && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Humedad Promedio:</span>
                        <span className="text-white">
                          {data.historicalData.indoor.humidity.unit}
                        </span>
                      </div>
                    )}
                    {data.historicalData.outdoor?.temperature && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Temp. Exterior:</span>
                        <span className="text-white">
                          {data.historicalData.outdoor.temperature.unit}
                        </span>
                      </div>
                    )}
                    {data.historicalData.outdoor?.rainfall && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Lluvia Total:</span>
                        <span className="text-white">
                          {data.historicalData.outdoor.rainfall.unit}
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-white/50 mt-2">
                      Datos del período seleccionado
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/50">
                    Sin datos disponibles
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceComparison;