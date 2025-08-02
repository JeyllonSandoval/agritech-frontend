// ============================================================================
// DEVICE HISTORICAL CHARTS
// Component to display historical charts for a single device
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, DeviceInfoData, DeviceCharacteristicsData, TimeRange } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTelemetry } from '../../../hooks/useTelemetry';
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
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DeviceHistoricalChartsProps {
  device: DeviceInfo | null;
  deviceName?: string;
  deviceInfo?: DeviceInfoData | null;
  deviceCharacteristics?: DeviceCharacteristicsData | null;
}

interface HistoricalData {
  unit: string;
  list: Record<string, string>;
}

interface DeviceHistoricalData {
  code: number;
  msg: string;
  time: string;
  data: {
    indoor?: {
      indoor?: {
        temperature?: HistoricalData;
        humidity?: HistoricalData;
      };
      temperature?: HistoricalData;
      humidity?: HistoricalData;
      pressure?: HistoricalData;
    };
    pressure?: {
      pressure?: {
        relative?: HistoricalData;
        absolute?: HistoricalData;
      };
      relative?: HistoricalData;
      absolute?: HistoricalData;
    };
    soil_ch1?: {
      soil_ch1?: {
        soilmoisture?: HistoricalData;
      };
      soilmoisture?: HistoricalData;
    };
    soilMoisture?: HistoricalData;
  };
}

// Función para formatear fechas
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para calcular estadísticas
function calcStats(list: Record<string, string> | undefined) {
  if (!list) return { min: 0, max: 0, avg: 0 };
  const values = Object.values(list).map(v => Number(v)).filter(v => !isNaN(v));
  if (values.length === 0) return { min: 0, max: 0, avg: 0 };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length
  };
}

// Componente de gráfico individual
const SingleDeviceChart = ({ 
  historicalData, 
  metric, 
  label, 
  unit, 
  path, 
  alternatePaths = []
}: {
  historicalData: DeviceHistoricalData | null;
  metric: string;
  label: string;
  unit: string;
  path: string[];
  alternatePaths?: string[][];
}) => {
  if (!historicalData || !historicalData.data) return null;

  let list = historicalData.data;
  let foundPath = false;
  
  // Intentar path principal
  let tempList = list;
  for (const p of path) tempList = tempList?.[p];
  if (tempList?.list) {
    list = tempList.list;
    foundPath = true;
  }
  
  // Si no se encontró, intentar paths alternativos
  if (!foundPath && alternatePaths) {
    for (const altPath of alternatePaths) {
      tempList = historicalData.data;
      for (const p of altPath) tempList = tempList?.[p];
      if (tempList?.list) {
        list = tempList.list;
        foundPath = true;
        break;
      } else if (tempList && typeof tempList === 'object' && Object.keys(tempList).length > 0) {
        list = tempList;
        foundPath = true;
        break;
      }
    }
  }
  
  if (!foundPath || !list) return null;

  const timestamps = Object.keys(list).sort();
  const chartData = {
    labels: timestamps.map(ts => formatDateTime(new Date(Number(ts) * 1000).toISOString())),
    datasets: [{
      label: label,
      data: timestamps.map(ts => list[ts] ? Number(list[ts]) : null),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      spanGaps: true,
      tension: 0.4,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: label,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          maxTicksLimit: 8,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  const stats = calcStats(foundPath ? list : undefined);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="h-80 mb-4">
        <Line data={chartData} options={options as any} />
      </div>
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-2">Estadísticas</h4>
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <span className="text-white/60">Mínimo:</span>
            <div className="text-white font-medium">{stats.min.toFixed(1)} {unit}</div>
          </div>
          <div>
            <span className="text-white/60">Máximo:</span>
            <div className="text-white font-medium">{stats.max.toFixed(1)} {unit}</div>
          </div>
          <div>
            <span className="text-white/60">Promedio:</span>
            <div className="text-white font-medium">{stats.avg.toFixed(1)} {unit}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeviceHistoricalCharts: React.FC<DeviceHistoricalChartsProps> = ({
  device,
  deviceName,
  deviceInfo,
  deviceCharacteristics
}) => {
  const [historicalData, setHistoricalData] = useState<DeviceHistoricalData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('one_day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener datos precargados del hook de telemetría
  const { 
    precachedData 
  } = useTelemetry();

  const fetchHistoricalData = async () => {
    if (!device) return;
    
    console.log(`🔄 [HISTORICAL] Buscando datos para ${device.DeviceName} (${timeRange})`);
    
    // Si es 'one_day' y tenemos datos precargados, usarlos
    if (timeRange === 'one_day' && precachedData?.historicalData?.[device.DeviceID]) {
      console.log(`✅ [HISTORICAL] Usando datos precargados para ${device.DeviceName}`);
      setHistoricalData(precachedData.historicalData[device.DeviceID]);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log(`🌐 [HISTORICAL] Descargando datos para ${device.DeviceName} (${timeRange})`);
      const deviceIds = [device.DeviceID];
      const response = await telemetryService.compareDevicesHistory(deviceIds, timeRange);
      
      if (response && (response as any).devices && (response as any).devices.length > 0) {
        const deviceData = (response as any).devices[0];
        setHistoricalData(deviceData.data);
        console.log(`✅ [HISTORICAL] Datos cargados para ${device.DeviceName}`);
      } else {
        setError('No se encontraron datos históricos');
        console.log(`❌ [HISTORICAL] Sin datos para ${device.DeviceName}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMsg);
      console.error(`❌ [HISTORICAL] Error para ${device.DeviceName}:`, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [device, timeRange]);

  // Cargar datos precargados al montar si están disponibles
  useEffect(() => {
    if (timeRange === 'one_day' && device && precachedData?.historicalData?.[device.DeviceID] && !historicalData) {
      setHistoricalData(precachedData.historicalData[device.DeviceID]);
    }
  }, [precachedData, device, timeRange, historicalData]);

  // Detectar qué datos están disponibles
  const availableMetrics = {
    temperature: false,
    humidity: false,
    pressure: false,
    soilMoisture: false
  };

  if (historicalData?.data) {
    const data = historicalData.data;
    
    // Temperatura
    if (data.indoor?.indoor?.temperature?.list || data.indoor?.temperature?.list) {
      availableMetrics.temperature = true;
    }

    // Humedad
    if (data.indoor?.indoor?.humidity?.list || data.indoor?.humidity?.list) {
      availableMetrics.humidity = true;
    }

    // Presión
    if (data.pressure?.pressure?.relative?.list || 
        data.pressure?.pressure?.absolute?.list ||
        data.indoor?.pressure?.list) {
      availableMetrics.pressure = true;
    }

    // Humedad del suelo
    if (data.soil_ch1?.soil_ch1?.soilmoisture?.list || 
        data.soil_ch1?.soilmoisture?.list ||
        data.soilMoisture?.list) {
      availableMetrics.soilMoisture = true;
    }
  }

  const availableCount = Object.values(availableMetrics).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        <span className="ml-3 text-white/70 text-lg">Cargando datos históricos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-red-300">Error al cargar datos</h3>
        </div>
        <p className="text-red-200/80 mb-4">{error}</p>
        <button
          onClick={fetchHistoricalData}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors mx-auto"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Datos Históricos</h4>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Período:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 text-sm rounded-lg bg-white/10 text-white border border-white/20 focus:border-emerald-400 focus:outline-none"
          >
            <option value="one_hour" className="bg-black text-white">1 Hora</option>
            <option value="one_day" className="bg-black text-white">1 Día</option>
            <option value="one_week" className="bg-black text-white">1 Semana</option>
            <option value="one_month" className="bg-black text-white">1 Mes</option>
            <option value="three_months" className="bg-black text-white">3 Meses</option>
          </select>
        </div>
      </div>

      {availableCount === 0 ? (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-orange-300">No hay datos históricos disponibles</h3>
          </div>
          <p className="text-orange-200/80">
            El dispositivo no tiene datos históricos para el período seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Temperatura */}
          {availableMetrics.temperature && (
            <SingleDeviceChart 
              historicalData={historicalData}
              metric="temperature"
              label="Temperatura"
              unit="°F"
              path={['indoor', 'indoor', 'temperature']}
              alternatePaths={[
                ['indoor', 'temperature'],
                ['temperature']
              ]}
            />
          )}

          {/* Humedad */}
          {availableMetrics.humidity && (
            <SingleDeviceChart 
              historicalData={historicalData}
              metric="humidity"
              label="Humedad"
              unit="%"
              path={['indoor', 'indoor', 'humidity']}
              alternatePaths={[
                ['indoor', 'humidity'],
                ['humidity']
              ]}
            />
          )}

          {/* Presión */}
          {availableMetrics.pressure && (
            <SingleDeviceChart 
              historicalData={historicalData}
              metric="pressure"
              label="Presión"
              unit="inHg"
              path={['pressure', 'pressure', 'relative']}
              alternatePaths={[
                ['pressure', 'pressure', 'absolute'],
                ['pressure', 'relative'],
                ['pressure', 'absolute'],
                ['indoor', 'pressure']
              ]}
            />
          )}

          {/* Humedad del Suelo */}
          {availableMetrics.soilMoisture && (
            <SingleDeviceChart 
              historicalData={historicalData}
              metric="soilMoisture"
              label="Humedad del Suelo CH1"
              unit="%"
              path={['soil_ch1', 'soil_ch1', 'soilmoisture']}
              alternatePaths={[
                ['soil_ch1', 'soilmoisture'],
                ['soilMoisture']
              ]}
            />
          )}

          {/* Información sobre sensores disponibles */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-blue-500/20">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-300 mb-1">Información sobre sensores</h4>
                <div className="text-xs text-blue-200/80 space-y-1">
                  <p>• Mostrando {availableCount} tipo(s) de sensor con datos históricos</p>
                  {!availableMetrics.pressure && (
                    <p>• El dispositivo no tiene sensores de presión configurados</p>
                  )}
                  {!availableMetrics.soilMoisture && (
                    <p>• El dispositivo no tiene sensores de humedad del suelo</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceHistoricalCharts;