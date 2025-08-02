// ============================================================================
// DEVICE COMPARISON COMPONENT
// Modern, minimalist device comparison interface
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { DeviceInfo, RealtimeData, HistoricalResponse, TimeRange } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  ChartBarIcon, 
  ClockIcon, 
  EyeIcon, 
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ScaleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

// Función para formatear fechas de manera más limpia
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

// Función para calcular valores máximos y mínimos entre dispositivos
const calculateComparisonStats = (comparisonData: ComparisonData[]) => {
  const stats = {
    temperature: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    humidity: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    pressure: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    windSpeed: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    windDirection: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    rainfall: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    uv: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    solarRadiation: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    feelsLike: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' },
    dewPoint: { max: -Infinity, min: Infinity, maxDevice: '', minDevice: '' }
  };

  comparisonData.forEach(data => {
    if (data.realtimeData) {
      // Temperatura
      const temp = data.realtimeData?.indoor?.temperature?.value || data.realtimeData?.temperature || data.realtimeData?.tempf;
      if (temp !== undefined && !isNaN(Number(temp))) {
        const tempValue = Number(temp);
        if (tempValue > stats.temperature.max) {
          stats.temperature.max = tempValue;
          stats.temperature.maxDevice = data.deviceName;
        }
        if (tempValue < stats.temperature.min) {
          stats.temperature.min = tempValue;
          stats.temperature.minDevice = data.deviceName;
        }
      }

      // Humedad
      const hum = data.realtimeData?.indoor?.humidity?.value || data.realtimeData?.humidity || data.realtimeData?.humidity1;
      if (hum !== undefined && !isNaN(Number(hum))) {
        const humValue = Number(hum);
        if (humValue > stats.humidity.max) {
          stats.humidity.max = humValue;
          stats.humidity.maxDevice = data.deviceName;
        }
        if (humValue < stats.humidity.min) {
          stats.humidity.min = humValue;
          stats.humidity.minDevice = data.deviceName;
        }
      }

      // Presión
      const press = data.realtimeData?.pressure?.relative?.value || data.realtimeData?.pressure || data.realtimeData?.baromrelin;
      if (press !== undefined && !isNaN(Number(press))) {
        const pressValue = Number(press);
        if (pressValue > stats.pressure.max) {
          stats.pressure.max = pressValue;
          stats.pressure.maxDevice = data.deviceName;
        }
        if (pressValue < stats.pressure.min) {
          stats.pressure.min = pressValue;
          stats.pressure.minDevice = data.deviceName;
        }
      }

      // Velocidad del viento
      const windSpeed = data.realtimeData?.wind?.wind_speed?.value || data.realtimeData?.windSpeed || data.realtimeData?.windspeedmph;
      if (windSpeed !== undefined && !isNaN(Number(windSpeed))) {
        const windSpeedValue = Number(windSpeed);
        if (windSpeedValue > stats.windSpeed.max) {
          stats.windSpeed.max = windSpeedValue;
          stats.windSpeed.maxDevice = data.deviceName;
        }
        if (windSpeedValue < stats.windSpeed.min) {
          stats.windSpeed.min = windSpeedValue;
          stats.windSpeed.minDevice = data.deviceName;
        }
      }

      // Dirección del viento
      const windDirection = data.realtimeData?.wind?.wind_direction?.value || data.realtimeData?.windDirection || data.realtimeData?.winddir;
      if (windDirection !== undefined && !isNaN(Number(windDirection))) {
        const windDirectionValue = Number(windDirection);
        if (windDirectionValue > stats.windDirection.max) {
          stats.windDirection.max = windDirectionValue;
          stats.windDirection.maxDevice = data.deviceName;
        }
        if (windDirectionValue < stats.windDirection.min) {
          stats.windDirection.min = windDirectionValue;
          stats.windDirection.minDevice = data.deviceName;
        }
      }

      // Lluvia
      const rainfall = (data.realtimeData?.rainfall as any)?.rain_rate?.value || data.realtimeData?.rainfall || data.realtimeData?.rainin;
      if (rainfall !== undefined && !isNaN(Number(rainfall))) {
        const rainfallValue = Number(rainfall);
        if (rainfallValue > stats.rainfall.max) {
          stats.rainfall.max = rainfallValue;
          stats.rainfall.maxDevice = data.deviceName;
        }
        if (rainfallValue < stats.rainfall.min) {
          stats.rainfall.min = rainfallValue;
          stats.rainfall.minDevice = data.deviceName;
        }
      }

      // UV
      const uv = data.realtimeData?.solar_and_uvi?.uvi?.value || data.realtimeData?.uv || data.realtimeData?.uv1;
      if (uv !== undefined && !isNaN(Number(uv))) {
        const uvValue = Number(uv);
        if (uvValue > stats.uv.max) {
          stats.uv.max = uvValue;
          stats.uv.maxDevice = data.deviceName;
        }
        if (uvValue < stats.uv.min) {
          stats.uv.min = uvValue;
          stats.uv.minDevice = data.deviceName;
        }
      }

      // Radiación solar
      const solarRadiation = data.realtimeData?.solar_and_uvi?.solar?.value || data.realtimeData?.solarRadiation || data.realtimeData?.solarradiation;
      if (solarRadiation !== undefined && !isNaN(Number(solarRadiation))) {
        const solarRadiationValue = Number(solarRadiation);
        if (solarRadiationValue > stats.solarRadiation.max) {
          stats.solarRadiation.max = solarRadiationValue;
          stats.solarRadiation.maxDevice = data.deviceName;
        }
        if (solarRadiationValue < stats.solarRadiation.min) {
          stats.solarRadiation.min = solarRadiationValue;
          stats.solarRadiation.minDevice = data.deviceName;
        }
      }

      // Sensación térmica
      const feelsLike = data.realtimeData?.outdoor?.feels_like?.value;
      if (feelsLike !== undefined && !isNaN(Number(feelsLike))) {
        const feelsLikeValue = Number(feelsLike);
        if (feelsLikeValue > stats.feelsLike.max) {
          stats.feelsLike.max = feelsLikeValue;
          stats.feelsLike.maxDevice = data.deviceName;
        }
        if (feelsLikeValue < stats.feelsLike.min) {
          stats.feelsLike.min = feelsLikeValue;
          stats.feelsLike.minDevice = data.deviceName;
        }
      }

      // Punto de rocío
      const dewPoint = data.realtimeData?.outdoor?.dew_point?.value;
      if (dewPoint !== undefined && !isNaN(Number(dewPoint))) {
        const dewPointValue = Number(dewPoint);
        if (dewPointValue > stats.dewPoint.max) {
          stats.dewPoint.max = dewPointValue;
          stats.dewPoint.maxDevice = data.deviceName;
        }
        if (dewPointValue < stats.dewPoint.min) {
          stats.dewPoint.min = dewPointValue;
          stats.dewPoint.minDevice = data.deviceName;
        }
      }
    }
  });

  return stats;
};

// Función para obtener el indicador visual de comparación
const getComparisonIndicator = (deviceName: string, metric: string, comparisonStats: any) => {
  const stats = comparisonStats[metric];
  if (stats.maxDevice === deviceName) {
    return { type: 'highest', color: 'text-emerald-400', bgColor: 'bg-emerald-400/20', icon: ArrowUpIcon };
  } else if (stats.minDevice === deviceName) {
    return { type: 'lowest', color: 'text-orange-400', bgColor: 'bg-orange-400/20', icon: ArrowDownIcon };
  }
  return { type: 'normal', color: 'text-white/60', bgColor: 'bg-white/5', icon: null };
};

// Componente de gráfica histórica mejorado
const HistoricalChart = ({ comparisonData, metric, label, unit, path, alternatePaths }: {
  comparisonData: ComparisonData[];
  metric: string;
  label: string;
  unit: string;
  path: string[];
  alternatePaths?: string[][];
}) => {
  const allTimestamps = new Set<string>();
  const datasets = comparisonData.map(device => {
    let list = device.historicalData?.data;
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
        tempList = device.historicalData?.data;
        for (const p of altPath) tempList = tempList?.[p];
        if (tempList?.list) {
          list = tempList.list;
          foundPath = true;
          break;
        } else if (tempList && typeof tempList === 'object' && Object.keys(tempList).length > 0) {
          // Si no tiene .list pero sí datos directos (estructura procesada)
          list = tempList;
          foundPath = true;
          break;
        }
      }
    }
    
    if (!foundPath || !list) return null;
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
    labels: sortedTimestamps.map(ts => formatDateTime(new Date(Number(ts) * 1000).toISOString())),
    datasets: datasets.map((ds, i) => ({
      label: ds!.label,
      data: sortedTimestamps.map(ts => ds!.data[ts] ? Number(ds!.data[ts]) : null),
      borderColor: i === 0 ? '#10b981' : '#f59e0b',
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14
          }
        }
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

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
      </div>
      <div className="h-80">
        <Line data={chartData} options={options as any} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {comparisonData.map((device, i) => {
          let list = device.historicalData?.data;
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
              tempList = device.historicalData?.data;
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
          
          const stats = calcStats(foundPath ? list : undefined);
          return (
            <div key={device.deviceId} className="p-3 bg-white/5 rounded-xl">
              <h4 className="text-sm font-medium text-white mb-2">{device.deviceName}</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Min:</span>
                  <span className="text-white">{stats.min.toFixed(1)} {unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Max:</span>
                  <span className="text-white">{stats.max.toFixed(1)} {unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Prom:</span>
                  <span className="text-white">{stats.avg.toFixed(1)} {unit}</span>
                </div>
              </div>
            </div>
          );
        })}
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

  // ============================================================================
  // FILTERS STATE
  // ============================================================================
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  // Obtener tipos únicos de dispositivos
  const deviceTypes = useMemo(() => {
    const types = [...new Set(devices.map(device => device.DeviceType))];
    return types.sort();
  }, [devices]);

  // Filtrar dispositivos por tipo, estado y búsqueda
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesType = deviceTypeFilter === 'all' || device.DeviceType === deviceTypeFilter;
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [devices, deviceTypeFilter, statusFilter, searchTerm]);

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
            realtimeData: deviceData?.data?.data || deviceData?.data || null,
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
      
      if (response && (response as any).devices) {
        const responseData = response as any;
        console.log('🔧 ResponseData completo:', responseData);
        console.log('🔧 Dispositivos en response:', responseData.devices);
        
        setTimeRangeInfo(responseData.timeRange);
        const data: ComparisonData[] = selectedDevices.map(device => {
          const deviceData = responseData.devices.find((d: any) => d.id === device.DeviceID);
          console.log('🔧 DeviceData encontrado para', device.DeviceName, ':', deviceData);
          console.log('🔧 Datos históricos del dispositivo:', deviceData?.data);
          
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
  // FILTER HANDLERS
  // ============================================================================

  const handleClearFilters = () => {
    setDeviceTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleDeviceTypeFilterChange = (type: string) => {
    setDeviceTypeFilter(type);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchBar = () => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-white/50" />
      </div>
      <input
        type="text"
        placeholder="Buscar dispositivos..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm placeholder-white/50"
      />
      {searchTerm && (
        <button
          onClick={() => handleSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-3">
      {/* Device Type Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Filtrar por tipo:</label>
          {(deviceTypeFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <XMarkIcon className="w-3 h-3" />
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDeviceTypeFilterChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceTypeFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Todos ({devices.length})
          </button>
          {deviceTypes.map(type => (
            <button
              key={type}
              onClick={() => handleDeviceTypeFilterChange(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                deviceTypeFilter === type
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              {type} ({devices.filter(d => d.DeviceType === type).length})
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      

        {/* Content */}
        <div className="flex flex-col gap-4 p-2">
          
          {/* Device Selection */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Seleccionar Dispositivos</h3>
                  <p className="text-white/60 text-sm">
                    {selectedDevices.length}/4 seleccionados • {devices.filter(d => d.status === 'active').length} activos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircleIcon className="w-4 h-4" />
                <span>{devices.filter(d => d.status === 'active').length} activos</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4 mb-4">
              {renderSearchBar()}
              {renderFilters()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDevices.map(device => {
                const isSelected = selectedDevices.some(d => d.DeviceID === device.DeviceID);
                const isActive = device.status === 'active';
                return (
                  <button
                    key={device.DeviceID}
                    onClick={() => handleDeviceToggle(device)}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                        : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-base">{device.DeviceName}</h4>
                        {isActive ? (
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm opacity-70">{device.DeviceType}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('realtime')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'realtime'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <EyeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Tiempo Real</span>
                </button>
                <button
                  onClick={() => setViewMode('historical')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'historical'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Histórico</span>
                </button>
              </div>

              {/* Time Range Selector */}
              {viewMode === 'historical' && (
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
              )}

              {/* Compare Button */}
              <button
                onClick={handleCompare}
                disabled={selectedDevices.length < 2 || loading}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium"
              >
                {loading ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <Cog6ToothIcon className="w-4 h-4" />
                )}
                <span>{loading ? 'Comparando...' : 'Comparar'}</span>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Comparison Results */}
          {comparisonData.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Resultados de la Comparación</h3>
                {timeRangeInfo && (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MdOutlineTimer className="w-4 h-4" />
                    <span>{formatDateTime(timeRangeInfo.startTime)} - {formatDateTime(timeRangeInfo.endTime)}</span>
                  </div>
                )}
              </div>

              {viewMode === 'realtime' ? (
                (() => {
                  const comparisonStats = calculateComparisonStats(comparisonData);
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {comparisonData.map((data) => {
                        console.log('🔧 Renderizando datos para', data.deviceName, ':', data);
                        return (
                          <div
                            key={data.deviceId}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-xl bg-emerald-500/20">
                                <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{data.deviceName}</h4>
                                <p className="text-white/60 text-sm">
                                  {viewMode === 'realtime' ? 'Datos en tiempo real' : 'Datos históricos'}
                                </p>
                              </div>
                            </div>
                            
                            {data.error ? (
                              <div className="flex items-center gap-2 text-red-400">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span className="text-sm">{data.error}</span>
                              </div>
                            ) : viewMode === 'realtime' && data.realtimeData ? (
                              <div className="space-y-3">
                                {/* Temperatura */}
                                {(data.realtimeData?.indoor?.temperature || data.realtimeData?.temperature || data.realtimeData?.tempf) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'temperature', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const tempValue = data.realtimeData?.indoor?.temperature?.value || data.realtimeData?.temperature || data.realtimeData?.tempf;
                                  const tempUnit = data.realtimeData?.indoor?.temperature?.unit || '°F';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Temperatura</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {tempValue} {tempUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Humedad */}
                                {(data.realtimeData?.indoor?.humidity || data.realtimeData?.humidity || data.realtimeData?.humidity1) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'humidity', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const humValue = data.realtimeData?.indoor?.humidity?.value || data.realtimeData?.humidity || data.realtimeData?.humidity1;
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Humedad</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {humValue}%
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Presión */}
                                {(data.realtimeData?.pressure?.relative || data.realtimeData?.pressure || data.realtimeData?.baromrelin) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'pressure', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const pressValue = data.realtimeData?.pressure?.relative?.value || (data.realtimeData?.pressure as any)?.value || data.realtimeData?.baromrelin;
                                  const pressUnit = data.realtimeData?.pressure?.relative?.unit || 'inHg';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Presión</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {pressValue} {pressUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Velocidad del viento */}
                                {(data.realtimeData?.wind?.wind_speed || data.realtimeData?.windSpeed || data.realtimeData?.windspeedmph) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'windSpeed', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const windSpeedValue = data.realtimeData?.wind?.wind_speed?.value || data.realtimeData?.windSpeed || data.realtimeData?.windspeedmph;
                                  const windSpeedUnit = data.realtimeData?.wind?.wind_speed?.unit || 'mph';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Velocidad del viento</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {windSpeedValue} {windSpeedUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Dirección del viento */}
                                {(data.realtimeData?.wind?.wind_direction || data.realtimeData?.windDirection || data.realtimeData?.winddir) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'windDirection', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const windDirValue = data.realtimeData?.wind?.wind_direction?.value || data.realtimeData?.windDirection || data.realtimeData?.winddir;
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Dirección del viento</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {windDirValue}°
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Lluvia */}
                                {(data.realtimeData?.rainfall || data.realtimeData?.rainin) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'rainfall', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const rainValue = data.realtimeData?.rainfall || data.realtimeData?.rainin;
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Lluvia</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {rainValue} in
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* UV */}
                                {(data.realtimeData?.solar_and_uvi?.uvi || data.realtimeData?.uv || data.realtimeData?.uv1) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'uv', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const uvValue = data.realtimeData?.solar_and_uvi?.uvi?.value || data.realtimeData?.uv || data.realtimeData?.uv1;
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Índice UV</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {uvValue}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Radiación solar */}
                                {(data.realtimeData?.solar_and_uvi?.solar || data.realtimeData?.solarRadiation || data.realtimeData?.solarradiation) && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'solarRadiation', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const solarValue = data.realtimeData?.solar_and_uvi?.solar?.value || data.realtimeData?.solarRadiation || data.realtimeData?.solarradiation;
                                  const solarUnit = data.realtimeData?.solar_and_uvi?.solar?.unit || 'W/m²';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Radiación solar</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {solarValue} {solarUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Sensación térmica */}
                                {data.realtimeData?.outdoor?.feels_like && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'feelsLike', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const feelsLikeValue = data.realtimeData.outdoor.feels_like.value;
                                  const feelsLikeUnit = data.realtimeData.outdoor.feels_like.unit || '°F';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Sensación térmica</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {feelsLikeValue} {feelsLikeUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                                {/* Punto de rocío */}
                                {data.realtimeData?.outdoor?.dew_point && (() => {
                                  const indicator = getComparisonIndicator(data.deviceName, 'dewPoint', comparisonStats);
                                  const IconComponent = indicator.icon;
                                  const dewPointValue = data.realtimeData.outdoor.dew_point.value;
                                  const dewPointUnit = data.realtimeData.outdoor.dew_point.unit || '°F';
                                  return (
                                    <div className={`flex items-center justify-between p-3 ${indicator.bgColor} rounded-xl border border-white/10`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white/70 text-sm">Punto de rocío</span>
                                        {IconComponent && (
                                          <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                                        )}
                                      </div>
                                      <span className={`font-medium ${indicator.color}`}>
                                        {dewPointValue} {dewPointUnit}
                                      </span>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-white/60 text-sm">No hay datos disponibles</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                (() => {
                  // Detectar qué datos están disponibles
                  const availableMetrics = {
                    temperature: false,
                    humidity: false,
                    pressure: false,
                    soilMoisture: false
                  };

                  // Verificar datos disponibles en los dispositivos
                  comparisonData.forEach(device => {
                    const data = device.historicalData?.data;
                    console.log('🔧 [FRONTEND] Checking device data for', device.deviceName, ':', data);
                    if (!data) return;

                    // Temperatura - Verificar múltiples estructuras
                    if (data.indoor?.temperature?.list || 
                        data.indoor?.indoor?.temperature?.list ||
                        data.outdoor?.temperature?.list || 
                        data.temperature?.list) {
                      availableMetrics.temperature = true;
                    }

                    // Humedad - Verificar múltiples estructuras
                    if (data.indoor?.humidity?.list || 
                        data.indoor?.indoor?.humidity?.list ||
                        data.outdoor?.humidity?.list || 
                        data.humidity?.list) {
                      availableMetrics.humidity = true;
                    }

                    // Presión - Verificar múltiples estructuras
                    if (data.indoor?.pressure?.list || 
                        data.outdoor?.pressure?.list || 
                        data.pressure?.list || 
                        data.pressure?.relative?.list || 
                        data.pressure?.absolute?.list ||
                        data.pressure?.pressure?.relative?.list ||
                        data.pressure?.pressure?.absolute?.list) {
                      availableMetrics.pressure = true;
                    }

                    // Humedad del suelo - Verificar múltiples estructuras
                    if (data.soilMoisture?.list || 
                        data.soil_ch1?.soilmoisture?.list || 
                        data.soil_ch1?.soil_ch1?.soilmoisture?.list ||
                        data.soil_ch1?.list?.soilmoisture?.list || 
                        data.soil_ch2?.soilmoisture?.list ||
                        data.soil_ch2?.soil_ch2?.soilmoisture?.list ||
                        data.soil_ch2?.list?.soilmoisture?.list) {
                      availableMetrics.soilMoisture = true;
                    }
                  });

                  const availableCount = Object.values(availableMetrics).filter(Boolean).length;

                  console.log('🔧 [FRONTEND] Available metrics detected:', availableMetrics);
                  console.log('🔧 [FRONTEND] Available count:', availableCount);

                  return (
                    <div className="space-y-6">
                      {availableCount === 0 && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
                            <h3 className="text-lg font-semibold text-orange-300">No hay datos históricos disponibles</h3>
                          </div>
                          <p className="text-orange-200/80">
                            Los dispositivos seleccionados no tienen datos históricos para mostrar.
                          </p>
                        </div>
                      )}

                      {/* Temperatura */}
                      {availableMetrics.temperature && (
                        <HistoricalChart 
                          comparisonData={comparisonData}
                          metric="temperature"
                          label="Temperatura"
                          unit="°F"
                          path={['indoor', 'indoor', 'temperature']}
                          alternatePaths={[
                            ['indoor', 'temperature'],
                            ['outdoor', 'temperature'],
                            ['temperature']
                          ]}
                        />
                      )}

                      {/* Humedad */}
                      {availableMetrics.humidity && (
                        <HistoricalChart 
                          comparisonData={comparisonData}
                          metric="humidity"
                          label="Humedad"
                          unit="%"
                          path={['indoor', 'indoor', 'humidity']}
                          alternatePaths={[
                            ['indoor', 'humidity'],
                            ['outdoor', 'humidity'],
                            ['humidity']
                          ]}
                        />
                      )}

                      {/* Presión */}
                      {availableMetrics.pressure && (
                        <HistoricalChart 
                          comparisonData={comparisonData}
                          metric="pressure"
                          label="Presión"
                          unit="inHg"
                          path={['pressure', 'pressure', 'relative']}
                          alternatePaths={[
                            ['pressure', 'pressure', 'absolute'],
                            ['pressure', 'relative'],
                            ['pressure', 'absolute'],
                            ['indoor', 'pressure'],
                            ['outdoor', 'pressure']
                          ]}
                        />
                      )}

                      {/* Humedad del Suelo */}
                      {availableMetrics.soilMoisture && (
                        <HistoricalChart 
                          comparisonData={comparisonData}
                          metric="soilMoisture"
                          label="Humedad del Suelo CH1"
                          unit="%"
                          path={['soil_ch1', 'soil_ch1', 'soilmoisture']}
                          alternatePaths={[
                            ['soil_ch1', 'soilmoisture'],
                            ['soil_ch1', 'list', 'soilmoisture'],
                            ['soil_ch2', 'soil_ch2', 'soilmoisture'],
                            ['soil_ch2', 'soilmoisture'],
                            ['soil_ch2', 'list', 'soilmoisture'],
                            ['soilMoisture']
                          ]}
                        />
                      )}

                      {/* Mensaje informativo sobre sensores faltantes */}
                      {availableCount > 0 && (
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
                                {!availableMetrics.pressure && (
                                  <p>• Los dispositivos no tienen sensores de presión configurados</p>
                                )}
                                {!availableMetrics.soilMoisture && (
                                  <p>• Los dispositivos no tienen sensores de humedad del suelo</p>
                                )}
                                <p>• Solo se muestran los datos disponibles para comparación</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      </div>
  );
};

export default DeviceComparison;