// ============================================================================
// REALTIME DATA DISPLAY
// Component to display realtime sensor data with new structure
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { RealtimeData, SensorValue, WeatherData, DeviceInfo, DeviceInfoData, DeviceCharacteristicsData, Group } from '../../../types/telemetry';
import { useDeviceWeather } from '../../../hooks/useDeviceWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import DeviceHistoricalCharts from './DeviceHistoricalCharts';
import EditModal from '../modals/editModal';
import { 
  WiThermometer, 
  WiHumidity, 
  WiBarometer, 
  WiRain, 
  WiStrongWind,
} from 'react-icons/wi';
import { CiBatteryCharging } from "react-icons/ci";
import { ChartBarIcon, ExclamationTriangleIcon, CogIcon } from '@heroicons/react/24/outline';


interface RealtimeDataDisplayProps {
  data: RealtimeData | Record<string, RealtimeData> | null;
  deviceName?: string;
  loading?: boolean;
  error?: string | null;
  onShowDeviceInfo?: () => void;
  onRetryData?: () => void; // Nueva prop para reintentar carga de datos
  onDeviceUpdate?: (updatedDevice: DeviceInfo) => void; // NUEVA: función para actualizar dispositivos
  onGroupUpdate?: (updatedGroup: Group) => void; // NUEVA: función para actualizar grupos
  device?: DeviceInfo | null;
  deviceInfo?: DeviceInfoData | null;
  deviceCharacteristics?: DeviceCharacteristicsData | null;
  isGroupData?: boolean;
}

const RealtimeDataDisplay: React.FC<RealtimeDataDisplayProps> = ({
  data,
  deviceName,
  loading,
  error,
  onShowDeviceInfo,
  onRetryData,
  onDeviceUpdate, // NUEVA: función para actualizar dispositivos
  onGroupUpdate, // NUEVA: función para actualizar grupos
  device = null,
  deviceInfo = null,
  deviceCharacteristics = null
}) => {
  const [showHistoricalCharts, setShowHistoricalCharts] = useState(false);
  const [showDeviceTimeout, setShowDeviceTimeout] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { weatherData, loading: weatherLoading, error: weatherError } = useDeviceWeather({ device, deviceInfo, deviceCharacteristics });

  // Función para verificar si los datos están realmente vacíos
  const isDataEmpty = (data: RealtimeData | Record<string, RealtimeData> | null): boolean => {
    console.log(`🔍 [DEBUG] isDataEmpty llamada para ${deviceName || device?.DeviceName}:`, data);
    
    if (!data) {
      console.log(`🔍 [DEBUG] Datos son null/undefined - considerando vacío`);
      return true;
    }
    
    // NUEVO: Verificar si es un error del API EcoWitt
    if (typeof data === 'object' && 'code' in data && 'msg' in data) {
      const apiResponse = data as any;
      if (apiResponse.code !== 0) {
        console.log(`🔍 [DEBUG] Error del API EcoWitt detectado:`, {
          code: apiResponse.code,
          msg: apiResponse.msg,
          isError: true
        });
        return true; // Considerar como vacío si hay error del API
      }
    }
    
    // Si es un objeto con dispositivos múltiples (grupos)
    if (typeof data === 'object' && !('temperature' in data)) {
      const isEmpty = Object.keys(data).length === 0;
      console.log(`🔍 [DEBUG] Datos de grupo, keys length:`, Object.keys(data).length, `isEmpty:`, isEmpty);
      return isEmpty;
    }
    
    // Si es datos de un solo dispositivo, verificar que tenga al menos un sensor con datos
    const singleDeviceData = data as RealtimeData;
    console.log(`🔍 [DEBUG] Datos de dispositivo individual:`, {
      temperature: singleDeviceData.temperature,
      humidity: singleDeviceData.humidity,
      pressure: singleDeviceData.pressure,
      wind_speed: singleDeviceData.wind_speed,
      rain: singleDeviceData.rain,
      battery: singleDeviceData.battery,
      soil_ch1: singleDeviceData.soil_ch1,
      soil_ch2: singleDeviceData.soil_ch2,
      solar_radiation: singleDeviceData.solar_radiation
    });
    
    const hasValidData = !!(
      (singleDeviceData.temperature && typeof singleDeviceData.temperature === 'object' && 'value' in singleDeviceData.temperature) ||
      (singleDeviceData.humidity && typeof singleDeviceData.humidity === 'object' && 'value' in singleDeviceData.humidity) ||
      (singleDeviceData.pressure && typeof singleDeviceData.pressure === 'object' && 'value' in singleDeviceData.pressure) ||
      singleDeviceData.wind_speed?.value !== undefined ||
      singleDeviceData.rain?.value !== undefined ||
      (singleDeviceData.battery && typeof singleDeviceData.battery === 'object' && 'value' in singleDeviceData.battery) ||
      singleDeviceData.soil_ch1?.soilmoisture?.value !== undefined ||
      singleDeviceData.soil_ch2?.soilmoisture?.value !== undefined ||
      singleDeviceData.solar_radiation?.value !== undefined
    );
    
    console.log(`🔍 [DEBUG] hasValidData:`, hasValidData, `returning isEmpty:`, !hasValidData);
    return !hasValidData;
  };

  // Timeout para detectar dispositivos sin datos
  useEffect(() => {
    console.log(`🔄 [TIMEOUT-EFFECT] useEffect ejecutado:`, {
      hasDevice: !!device,
      deviceName: deviceName || device?.DeviceName,
      loading,
      error,
      data
    });

    if (device && !loading) {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        console.log(`🧹 [TIMEOUT] Limpiando timeout anterior para ${deviceName || device.DeviceName}`);
        clearTimeout(timeoutRef.current);
      }

      // Verificar si los datos están realmente vacíos
      const dataEmpty = isDataEmpty(data);
      
      console.log(`🔄 [TIMEOUT-CHECK] Para ${deviceName || device.DeviceName}:`, {
        dataEmpty,
        hasError: !!error,
        willStartTimeout: dataEmpty && !error
      });
      
      if (dataEmpty && !error) {
        console.log(`⏱️ [TIMEOUT] Iniciando timeout de 3s para ${deviceName || device.DeviceName}`);
        
        timeoutRef.current = setTimeout(() => {
          console.log(`⏰ [TIMEOUT-CALLBACK] Ejecutando callback después de 3s para ${deviceName || device.DeviceName}`);
          // Verificar nuevamente si sigue sin datos antes de mostrar error
          const stillEmpty = isDataEmpty(data);
          const stillNoError = !error;
          
          console.log(`🔄 [TIMEOUT-RECHECK] Recheck después de 3s:`, {
            stillEmpty,
            stillNoError,
            willShowTimeout: stillEmpty && stillNoError
          });
          
          if (stillEmpty && stillNoError) {
            console.log(`❌ [TIMEOUT] Mostrando mensaje de timeout para ${deviceName || device.DeviceName}`);
            setShowDeviceTimeout(true);
          } else {
            console.log(`✅ [TIMEOUT] NO mostrando timeout - datos llegaron o hay error`);
          }
        }, 3000); // 3 segundos (reducido para debugging)
      } else if (!dataEmpty) {
        // Si hay datos válidos, limpiar el timeout y ocultar mensaje de error
        setShowDeviceTimeout(false);
        console.log(`✅ [TIMEOUT] Datos válidos recibidos para ${deviceName || device.DeviceName}`);
      } else if (error) {
        console.log(`⚠️ [TIMEOUT] No iniciando timeout porque ya hay error: ${error}`);
      }
    } else {
      console.log(`⏸️ [TIMEOUT] No procesando timeout:`, {
        noDevice: !device,
        loading
      });
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [device, data, loading, deviceName, error]);

  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDeviceUpdated = (updatedData: DeviceInfo | Group) => {
    console.log('✅ [REALTIME-DISPLAY] Elemento actualizado:', updatedData);
    setShowEditModal(false);
    setShowDeviceTimeout(false); // Ocultar mensaje de error después de editar
    
    // NUEVO: Propagar la actualización al componente padre
    if ('DeviceID' in updatedData && onDeviceUpdate) {
      console.log('🚀 [REALTIME-DISPLAY] Propagando actualización de dispositivo al Dashboard');
      onDeviceUpdate(updatedData as DeviceInfo);
    } else if ('GroupID' in updatedData && onGroupUpdate) {
      console.log('🚀 [REALTIME-DISPLAY] Propagando actualización de grupo al Dashboard');
      onGroupUpdate(updatedData as Group);
    }
  };

  const handleRetryConnection = () => {
    console.log(`🔄 [RETRY] Reintentando conexión para ${deviceName || device?.DeviceName}`);
    setShowDeviceTimeout(false);
    
    // Llamar a la función de retry del componente padre si está disponible
    if (onRetryData) {
      onRetryData();
    }
    
    // Reiniciar el timeout
    if (device) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (isDataEmpty(data) && !error) {
          console.log(`❌ [RETRY-TIMEOUT] Aún sin datos después del reintento para ${deviceName || device.DeviceName}`);
          setShowDeviceTimeout(true);
        }
      }, 3000);
    }
  };

  const formatValue = (sensorValue: SensorValue | number) => {
    if (typeof sensorValue === 'number') {
      return `${sensorValue}`;
    }
    return `${sensorValue.value} ${sensorValue.unit}`;
  };

  const formatTime = (timestamp: string | number) => {
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    }
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString();
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return <WiThermometer className="w-5 h-5" />;
      case 'humidity':
        return <WiHumidity className="w-5 h-5" />;
      case 'pressure':
        return <WiBarometer className="w-5 h-5" />;
      case 'soilmoisture':
        return <WiRain className="w-5 h-5" />;
      case 'battery':
        return <CiBatteryCharging className="w-5 h-5" />;
      default:
        return <WiThermometer className="w-5 h-5" />;
    }
  };



  const getSensorColor = (sensorType: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    switch (sensorType) {
      case 'temperature':
        if (numValue > 30) return 'text-red-400';
        if (numValue > 25) return 'text-yellow-400';
        return 'text-green-400';
      case 'humidity':
        if (numValue < 30) return 'text-red-400';
        if (numValue < 50) return 'text-yellow-400';
        return 'text-green-400';
      case 'soilmoisture':
        if (numValue < 30) return 'text-red-400';
        if (numValue < 50) return 'text-yellow-400';
        return 'text-green-400';
      case 'battery':
        if (numValue < 2.5) return 'text-red-400';
        if (numValue < 3.0) return 'text-yellow-400';
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-white/70 text-lg">Cargando datos en tiempo real...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 font-medium">Error al cargar datos</p>
            <p className="text-white/60 text-sm mt-2">{error}</p>
          </div>
        </div>
      );
    }

    // NUEVO: Verificar timeout antes que la condición !data
    if (showDeviceTimeout && device) {
      console.log(`🎯 [RENDER] Renderizando mensaje de timeout para ${deviceName || device.DeviceName}`);
      return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-400 mb-2">
            {(data as any)?.code === 40010 ? 'Configuración Inválida' : 'Dispositivo sin respuesta (3s)'}
          </h3>
          <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
            {(data as any)?.code === 40010 ? (
              <>El dispositivo <strong>{deviceName || device.DeviceName}</strong> tiene una <strong>Configuración inválida</strong>. 
              Necesitas configurar las credenciales correctas del dispositivo.</>
            ) : (
              <>El dispositivo <strong>{deviceName || device.DeviceName}</strong> no está enviando datos después de 3 segundos de espera. 
              Esto puede deberse a una configuración incorrecta de la API Key o problemas de conectividad.</>
            )}
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 max-w-lg mx-auto">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm">
                <p className="text-amber-300 font-medium mb-2">Posibles causas:</p>
                <ul className="text-amber-200/80 space-y-1 text-xs">
                  <li>• API Key incorrecta o expirada</li>
                  <li>• Application Key incorrecta</li>
                  <li>• Dispositivo desconectado</li>
                  <li>• MAC address incorrecta</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 flex-wrap text-lg">
            <button
              onClick={() => {
                console.log('🎯 [MODAL] Abriendo modal de configuración para:', device?.DeviceName);
                setShowEditModal(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg 
                       flex items-center gap-2 transition-colors font-medium"
            >
              <CogIcon className="w-4 h-4" />
              Configurar Dispositivo
            </button>
            <button
              onClick={handleRetryConnection}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg 
                       flex items-center gap-2 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar
            </button>
          </div>


        </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 712 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-white/60 text-sm">No hay datos disponibles</p>
          </div>
        </div>
      );
    }

    // Return principal con todos los datos
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      {/* Información del dispositivo */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {showHistoricalCharts ? 'Gráficos Históricos' : 'Datos en Tiempo Real'}
        </h3>
        {deviceName && (
          <div className="flex items-center gap-4">
            <span className="text-lg text-white/60">{deviceName}</span>
            <div className="flex items-center gap-3">
              {/* Toggle de vista - similar a los botones de la imagen */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setShowHistoricalCharts(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    !showHistoricalCharts
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium">Tiempo Real</span>
                </button>
                <button
                  onClick={() => setShowHistoricalCharts(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    showHistoricalCharts
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  type="button"
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Histórico</span>
                </button>
              </div>
              
              {/* Botón de información del dispositivo */}
              {onShowDeviceInfo && (
                <button
                  onClick={onShowDeviceInfo}
                  className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                  title="Ver información del dispositivo"
                  type="button"
                >
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido condicional: gráficos históricos o datos en tiempo real */}
      {showHistoricalCharts ? (
        <DeviceHistoricalCharts 
          device={device}
          deviceName={deviceName}
          deviceInfo={deviceInfo}
          deviceCharacteristics={deviceCharacteristics}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Indoor Sensors */}
        {data.indoor && (
          <>
            {data.indoor.temperature && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('temperature')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Temperatura Interior</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('temperature', typeof data.indoor.temperature === 'object' ? data.indoor.temperature.value : data.indoor.temperature)}`}>
                    {formatValue(data.indoor.temperature)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(typeof data.indoor.temperature === 'object' ? data.indoor.temperature.time : Date.now())}
                  </p>
                </div>
              </div>
            )}

            {data.indoor.humidity && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('humidity')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad Interior</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('humidity', typeof data.indoor.humidity === 'object' ? data.indoor.humidity.value : data.indoor.humidity)}`}>
                    {formatValue(data.indoor.humidity)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(typeof data.indoor.humidity === 'object' ? data.indoor.humidity.time : Date.now())}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pressure Sensors */}
        {data.pressure && (
          <>
            {data.pressure.relative && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('pressure')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Presión Relativa</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.pressure.relative)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.pressure.relative.time)}
                  </p>
                </div>
              </div>
            )}

            {data.pressure.absolute && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('pressure')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Presión Absoluta</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.pressure.absolute)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.pressure.absolute.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Soil Sensors CH1 */}
        {data.soil_ch1 && (
          <>
            {data.soil_ch1.soilmoisture && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('soilmoisture')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad del Suelo CH1</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('soilmoisture', data.soil_ch1.soilmoisture.value)}`}>
                    {formatValue(data.soil_ch1.soilmoisture)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch1.soilmoisture.time)}
                  </p>
                </div>
              </div>
            )}

            {data.soil_ch1.ad && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-white">Señal Analógica CH1</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.soil_ch1.ad)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch1.ad.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Soil Sensors CH9 */}
        {data.soil_ch9 && (
          <>
            {data.soil_ch9.soilmoisture && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('soilmoisture')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad del Suelo CH9</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('soilmoisture', data.soil_ch9.soilmoisture.value)}`}>
                    {formatValue(data.soil_ch9.soilmoisture)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch9.soilmoisture.time)}
                  </p>
                </div>
              </div>
            )}

            {data.soil_ch9.ad && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-white">Señal Analógica CH9</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.soil_ch9.ad)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch9.ad.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Battery Sensors */}
        {data.battery && data.battery.soilmoisture_sensor_ch1 && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-emerald-400">
                {getSensorIcon('battery')}
              </div>
              <h4 className="text-sm font-medium text-white">Batería Sensor Suelo</h4>
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-semibold ${getSensorColor('battery', data.battery.soilmoisture_sensor_ch1.value)}`}>
                {formatValue(data.battery.soilmoisture_sensor_ch1)}
              </p>
              <p className="text-xs text-white/50">
                Actualizado: {formatTime(data.battery.soilmoisture_sensor_ch1.time)}
              </p>
            </div>
          </div>
        )}
        
      </div>
      )}
      
      {/* Tarjeta de clima básico usando SimpleWeatherDisplay */}
      {weatherData && weatherData.current && (
        <SimpleWeatherDisplay
          weatherData={weatherData}
          variant="realtime"
          className=""
        />
      )}
      
      {/* Mostrar error de clima solo si no está cargando */}
      {weatherError && !weatherLoading && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-red-400 text-sm">{weatherError}</p>
        </div>
      )}

      {/* Last Update Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50 text-center">
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>

      </div>
    );
  };

  // Return principal del componente con contenido Y modal separados
  return (
    <>
      {renderContent()}
      
      {/* Modal de edición de dispositivo - SIEMPRE disponible */}
      {device && (
        <EditModal
          isOpen={showEditModal}
          type="device"
          data={device}
          onClose={() => {
            console.log('🎯 [MODAL] Modal cerrado');
            setShowEditModal(false);
          }}
          onUpdated={handleDeviceUpdated}
        />
      )}
    </>
  );
};

export default RealtimeDataDisplay; 