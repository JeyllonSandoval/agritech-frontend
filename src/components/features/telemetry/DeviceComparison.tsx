// ============================================================================
// DEVICE COMPARISON COMPONENT
// Component for comparing multiple devices data
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, RealtimeData, HistoricalResponse, TimeRange } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChartBarIcon, ClockIcon, EyeIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MdOutlineTimer } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

// Utilidad para calcular promedio, min y max
function calcStats(list: Record<string, string> | undefined) {
  if (!list || Object.values(list).length === 0) return { avg: 'N/A', min: 'N/A', max: 'N/A' };
  const values = Object.values(list).map(Number);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const min = Math.min(...values).toFixed(1);
  const max = Math.max(...values).toFixed(1);
  return { avg, min, max };
}

// Componente de gráfica histórica
const HistoricalChart = ({ comparisonData, metric, label, unit, path }: {
  comparisonData: ComparisonData[];
  metric: string;
  label: string;
  unit: string;
  path: string[];
}) => {
  // path: ejemplo ['indoor', 'temperature']
  // Construir labels (timestamps) y datasets
  const allTimestamps = new Set<string>();
  const datasets = comparisonData.map(device => {
    let list = device.historicalData?.data;
    for (const p of path) list = list?.[p];
    list = list?.list;
    if (!list) return null;
    Object.keys(list).forEach(ts => allTimestamps.add(ts));
    return {
      label: device.deviceName,
      data: list,
      color: undefined,
      borderColor: undefined,
      backgroundColor: undefined
    };
  }).filter(Boolean);
  const sortedTimestamps = Array.from(allTimestamps).sort();
  const chartData = {
    labels: sortedTimestamps.map(ts => new Date(Number(ts) * 1000).toLocaleString()),
    datasets: datasets.map((ds, i) => ({
      label: ds!.label,
      data: sortedTimestamps.map(ts => ds!.data[ts] ? Number(ds!.data[ts]) : null),
      borderColor: i === 0 ? '#10b981' : '#f59e0b', // Verde para el primer dispositivo, ámbar para el segundo
      backgroundColor: i === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: i === 0 ? '#10b981' : '#f59e0b',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      spanGaps: true,
      tension: 0.4,
      fill: true
    }))
  };
  return (
    <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-white font-medium text-lg">{label}</h5>
        <span className="text-white/60 text-sm">{unit}</span>
      </div>
      <div style={{ width: '100%' }}>
        <Line data={chartData} options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: { 
            legend: { 
              display: true,
              position: 'top' as const,
              labels: {
                color: '#ffffff',
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true
            }
          },
          scales: { 
            y: { 
              beginAtZero: false,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#ffffff',
                font: { size: 12 }
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#ffffff',
                font: { size: 11 },
                maxRotation: 0,
                callback: function(value, index, values) {
                  // Mostrar solo cada 3er label para evitar amontonamiento
                  if (index % 3 === 0) {
                    const date = new Date(this.getLabelForValue(value as number));
                    return date.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    });
                  }
                  return '';
                }
              }
            }
          },
          elements: {
            point: {
              hoverBackgroundColor: '#ffffff',
              hoverBorderColor: '#000000'
            }
          }
        }} />
      </div>
    </div>
  );
};

const DeviceComparison: React.FC<DeviceComparisonProps> = ({ devices, onClose }) => {
  const { t } = useTranslation();
  const [selectedDevices, setSelectedDevices] = useState<DeviceInfo[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('one_day');
  const [viewMode, setViewMode] = useState<'realtime' | 'historical'>('realtime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRangeInfo, setTimeRangeInfo] = useState<{ startTime: string; endTime: string } | null>(null);

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
    }
  }, []);

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
      
      // El backend devuelve directamente { timestamp, devices: [{ id, name, type, data }] }
      // No tiene la estructura { success, data }
      if (response && (response as any).devices) {
        const responseData = response as any;
        console.log('🔧 ResponseData completo:', responseData);
        console.log('🔧 Dispositivos en response:', responseData.devices);
        
        const data: ComparisonData[] = selectedDevices.map(device => {
          const deviceData = responseData.devices.find((d: any) => d.id === device.DeviceID);
          console.log('🔧 DeviceData encontrado para', device.DeviceName, ':', deviceData);
          console.log('🔧 Datos reales del dispositivo:', deviceData?.data);
          
          return {
            deviceId: device.DeviceID,
            deviceName: device.DeviceName,
            realtimeData: deviceData?.data?.data || deviceData?.data || null, // Intentar ambas estructuras
            error: deviceData ? undefined : 'No se encontraron datos para este dispositivo'
          };
        });
        
        console.log('🔧 ComparisonData final:', data);
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
      console.log('🔧 Comparando dispositivos históricos:', deviceIds, 'timeRange:', timeRange);
      
      const response = await telemetryService.compareDevicesHistory(deviceIds, timeRange);
      console.log('🔧 Respuesta completa del backend:', response);
      
      // El backend devuelve directamente { timeRange: { startTime, endTime }, devices: [{ id, name, type, data }] }
      // No tiene la estructura { success, data }
      if (response && (response as any).devices) {
        const responseData = response as any;
        console.log('🔧 ResponseData completo:', responseData);
        console.log('🔧 Dispositivos en response:', responseData.devices);
        
        setTimeRangeInfo(responseData.timeRange);
        const data: ComparisonData[] = selectedDevices.map(device => {
          const deviceData = responseData.devices.find((d: any) => d.id === device.DeviceID);
          console.log('🔧 DeviceData encontrado para', device.DeviceName, ':', deviceData);
          console.log('🔧 Datos históricos del dispositivo:', deviceData?.data);
          
          // Verificar si hay error de rate limiting
          let error: string | undefined = undefined;
          if (deviceData?.data?.code === -1 && deviceData?.data?.msg === 'Operation too frequent') {
            error = 'API limitado - Intenta en unos minutos';
          } else if (!deviceData) {
            error = 'No se encontraron datos para este dispositivo';
          }
          
          return {
            deviceId: device.DeviceID,
            deviceName: device.DeviceName,
            historicalData: deviceData?.data || null,
            error
          };
        });
        console.log('🔧 ComparisonData final:', data);
        setComparisonData(data);
      } else {
        console.log('🔧 Error: response no tiene la estructura esperada:', response);
        setError('Error al obtener datos históricos');
      }
    } catch (error) {
      console.error('🔧 Error en comparación histórica:', error);
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
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mt-10 border border-white/20 shadow-lg text-lg">
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
                     {viewMode === 'historical' && comparisonData.length > 0 && (
             <div className="mb-8">
               <HistoricalChart
                 comparisonData={comparisonData}
                 metric="temperature"
                 label="Temperatura Interior"
                 unit={comparisonData[0]?.historicalData?.data?.indoor?.temperature?.unit || '°C'}
                 path={["indoor", "temperature"]}
               />
               <HistoricalChart
                 comparisonData={comparisonData}
                 metric="humidity"
                 label="Humedad Interior"
                 unit={comparisonData[0]?.historicalData?.data?.indoor?.humidity?.unit || '%'}
                 path={["indoor", "humidity"]}
               />
             </div>
           )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-lg">
            {comparisonData.map((data) => {
              console.log('🔧 Renderizando datos para', data.deviceName, ':', data);
              return (
                <div
                  key={data.deviceId}
                  className="bg-white/5 border border-white/20 rounded-lg p-4"
                >
                  <h4 className="font-medium text-white mb-3">{data.deviceName}</h4>
                  
                  {data.error ? (
                    <p className="text-red-400 text-sm">{data.error}</p>
                  ) : viewMode === 'realtime' && data.realtimeData ? (
                  <div className="space-y-2">
                    {/* Temperatura */}
                    {data.realtimeData?.indoor?.temperature && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Temperatura:</span>
                        <span className="text-white">
                          {data.realtimeData.indoor.temperature.value} {data.realtimeData.indoor.temperature.unit}
                        </span>
                      </div>
                    )}
                    {/* Humedad */}
                    {data.realtimeData?.indoor?.humidity && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Humedad:</span>
                        <span className="text-white">
                          {data.realtimeData.indoor.humidity.value} {data.realtimeData.indoor.humidity.unit}
                        </span>
                      </div>
                    )}
                    {/* Presión */}
                    {data.realtimeData?.pressure?.relative && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Presión:</span>
                        <span className="text-white">
                          {data.realtimeData.pressure.relative.value} {data.realtimeData.pressure.relative.unit}
                        </span>
                      </div>
                    )}
                  </div>
                ) : viewMode === 'historical' && data.historicalData ? (
                  <div className="space-y-2">
                    {data.historicalData.data && (
                      <>
                        {data.historicalData.data.indoor?.temperature?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Temp. Interior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.indoor.temperature.list).avg} {data.historicalData.data.indoor.temperature.unit} | Min: {calcStats(data.historicalData.data.indoor.temperature.list).min} | Max: {calcStats(data.historicalData.data.indoor.temperature.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.indoor?.humidity?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Humedad Interior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.indoor.humidity.list).avg} {data.historicalData.data.indoor.humidity.unit} | Min: {calcStats(data.historicalData.data.indoor.humidity.list).min} | Max: {calcStats(data.historicalData.data.indoor.humidity.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.outdoor?.temperature?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Temp. Exterior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.outdoor.temperature.list).avg} {data.historicalData.data.outdoor.temperature.unit} | Min: {calcStats(data.historicalData.data.outdoor.temperature.list).min} | Max: {calcStats(data.historicalData.data.outdoor.temperature.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.outdoor?.humidity?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Humedad Exterior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.outdoor.humidity.list).avg} {data.historicalData.data.outdoor.humidity.unit} | Min: {calcStats(data.historicalData.data.outdoor.humidity.list).min} | Max: {calcStats(data.historicalData.data.outdoor.humidity.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.outdoor?.rainfall?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Lluvia Exterior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.outdoor.rainfall.list).avg} {data.historicalData.data.outdoor.rainfall.unit} | Min: {calcStats(data.historicalData.data.outdoor.rainfall.list).min} | Max: {calcStats(data.historicalData.data.outdoor.rainfall.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.indoor?.pressure?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Presión Interior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.indoor.pressure.list).avg} {data.historicalData.data.indoor.pressure.unit} | Min: {calcStats(data.historicalData.data.indoor.pressure.list).min} | Max: {calcStats(data.historicalData.data.indoor.pressure.list).max}
                            </span>
                          </div>
                        )}
                        {data.historicalData.data.outdoor?.pressure?.list && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Presión Exterior:</span>
                            <span className="text-white">
                              Prom: {calcStats(data.historicalData.data.outdoor.pressure.list).avg} {data.historicalData.data.outdoor.pressure.unit} | Min: {calcStats(data.historicalData.data.outdoor.pressure.list).min} | Max: {calcStats(data.historicalData.data.outdoor.pressure.list).max}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-white/50">
                    Sin datos disponibles
                    {data.realtimeData && (
                      <div className="text-xs text-white/30 mt-1">
                        Debug: {JSON.stringify(data.realtimeData).substring(0, 100)}...
                      </div>
                    )}
                    {!data.realtimeData && (
                      <div className="text-xs text-white/30 mt-1">
                        Debug: realtimeData es null o undefined
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceComparison;