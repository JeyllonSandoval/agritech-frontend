import { useState, useCallback, useEffect } from 'react';
import { DeviceInfo, DeviceInfoData, DeviceCharacteristicsData, Group, WeatherData } from '../types/telemetry';
import telemetryService from '../services/telemetryService';

interface UseDeviceWeatherOptions {
  device: DeviceInfo | null;
  deviceInfo: DeviceInfoData | null;
  deviceCharacteristics: DeviceCharacteristicsData | null;
  group?: Group | null;
  groupDevicesCharacteristics?: Record<string, DeviceCharacteristicsData>;
}

export function useDeviceWeather({ 
  device, 
  deviceInfo, 
  deviceCharacteristics, 
  group,
  groupDevicesCharacteristics 
}: UseDeviceWeatherOptions) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroupAverageLocation = (group: Group | null, devicesCharacteristics?: Record<string, DeviceCharacteristicsData>) => {
    if (!group || !devicesCharacteristics || Object.keys(devicesCharacteristics).length === 0) {
      console.log('🔍 [useDeviceWeather] No group or devices characteristics available');
      return null;
    }

    const validLocations: Array<{lat: number, lon: number}> = [];

    // Buscar ubicaciones en deviceCharacteristics.ecowittInfo.data
    Object.values(devicesCharacteristics).forEach((characteristics: DeviceCharacteristicsData) => {
      const ecoWittData = characteristics?.ecowittInfo?.data;
      console.log('🔍 [useDeviceWeather] Checking characteristics:', characteristics.deviceId, 'ecowittData:', ecoWittData);
      if (ecoWittData?.latitude && ecoWittData?.longitude && 
          typeof ecoWittData.latitude === 'number' && typeof ecoWittData.longitude === 'number' &&
          !isNaN(ecoWittData.latitude) && !isNaN(ecoWittData.longitude)) {
        validLocations.push({ 
          lat: ecoWittData.latitude, 
          lon: ecoWittData.longitude 
        });
        console.log('🔍 [useDeviceWeather] Added location from characteristics:', { lat: ecoWittData.latitude, lon: ecoWittData.longitude });
      }
    });

    if (validLocations.length === 0) {
      console.log('🔍 [useDeviceWeather] No valid locations found in characteristics');
      return null;
    }

    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
    const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;

    console.log('🔍 [useDeviceWeather] Average location calculated:', { avgLat, avgLon });
    console.log('🔍 [useDeviceWeather] Valid locations found:', validLocations.length);

    return { latitude: avgLat, longitude: avgLon };
  };

  const fetchWeather = useCallback(async () => {
    // No hacer nada si no hay dispositivo o grupo seleccionado
    if (!device && !group) {
      setWeatherData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Para dispositivos individuales, esperar a que deviceInfo o deviceCharacteristics estén disponibles
    if (device && !deviceInfo && !deviceCharacteristics) {
      console.log('🔍 [useDeviceWeather] Waiting for device info or characteristics to load...');
      setLoading(true);
      setError(null);
      return;
    }

    // Para grupos, esperar a que groupDevicesCharacteristics esté disponible
    if (group && (!groupDevicesCharacteristics || Object.keys(groupDevicesCharacteristics).length === 0)) {
      console.log('🔍 [useDeviceWeather] Waiting for group devices characteristics to load...');
      setLoading(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let lat: number | null = null;
      let lon: number | null = null;
      
      // 1. Buscar en deviceInfo
      if (device && typeof deviceInfo?.latitude === 'number' && typeof deviceInfo?.longitude === 'number') {
        lat = deviceInfo.latitude;
        lon = deviceInfo.longitude;
        console.log('🔍 [useDeviceWeather] Using location from deviceInfo:', { lat, lon });
      }
      // 2. Si no hay en deviceInfo, buscar en deviceCharacteristics.ecowittInfo.data
      else if (
        device &&
        deviceCharacteristics?.ecowittInfo?.data &&
        typeof deviceCharacteristics.ecowittInfo.data.latitude === 'number' &&
        typeof deviceCharacteristics.ecowittInfo.data.longitude === 'number'
      ) {
        lat = deviceCharacteristics.ecowittInfo.data.latitude;
        lon = deviceCharacteristics.ecowittInfo.data.longitude;
        console.log('🔍 [useDeviceWeather] Using location from deviceCharacteristics:', { lat, lon });
      }
      // 3. Si deviceInfo existe pero lat/lon es null o no es número, intentar fallback a deviceCharacteristics
      else if (
        device &&
        deviceInfo &&
        (deviceInfo.latitude == null || isNaN(deviceInfo.latitude) || deviceInfo.longitude == null || isNaN(deviceInfo.longitude)) &&
        deviceCharacteristics?.ecowittInfo?.data &&
        typeof deviceCharacteristics.ecowittInfo.data.latitude === 'number' &&
        typeof deviceCharacteristics.ecowittInfo.data.longitude === 'number'
      ) {
        lat = deviceCharacteristics.ecowittInfo.data.latitude;
        lon = deviceCharacteristics.ecowittInfo.data.longitude;
        console.log('🔍 [useDeviceWeather] Using fallback location from deviceCharacteristics:', { lat, lon });
      }
      // 4. Si es un grupo, calcular promedio usando groupDevicesCharacteristics
      else if (group && groupDevicesCharacteristics) {
        const avgLoc = getGroupAverageLocation(group, groupDevicesCharacteristics);
        if (avgLoc) {
          lat = avgLoc.latitude;
          lon = avgLoc.longitude;
          console.log('🔍 [useDeviceWeather] Using average location from group:', { lat, lon });
        }
      }
      
      if (lat == null || lon == null) {
        console.log('🔍 [useDeviceWeather] No location found, showing error');
        setError('No se pudo determinar la ubicación para obtener el clima.');
        setWeatherData(null);
        setLoading(false);
        return;
      }
      
      console.log('🔍 [useDeviceWeather] Fetching weather data for location:', { lat, lon });
      const response = await telemetryService.getWeatherOverview(lat, lon, 'metric', 'es');
      
      if (!response.success) {
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join('; ') 
          : response.error || 'Error al obtener datos de clima';
        
        // Manejar específicamente errores de timeout
        if (errorMessage.toLowerCase().includes('timeout')) {
          console.warn('🔍 [useDeviceWeather] Weather API timeout detected');
          setError('Request timeout - OpenWeather API is not responding');
        } else {
          setError(errorMessage);
        }
        setWeatherData(null);
        setLoading(false);
        return;
      }
      
      setWeatherData(response.data || null);
      setError(null); // Limpiar errores previos si la carga fue exitosa
      console.log('🔍 [useDeviceWeather] Weather data loaded successfully');
    } catch (err: any) {
      console.error('🔍 [useDeviceWeather] Error fetching weather:', err);
      
      // Manejar específicamente errores de timeout
      const errorMessage = err.message || 'Error al obtener datos de clima';
      if (errorMessage.toLowerCase().includes('timeout')) {
        setError('Request timeout - OpenWeather API is not responding');
      } else {
        setError(errorMessage);
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [device, deviceInfo, deviceCharacteristics, group, groupDevicesCharacteristics]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weatherData, loading, error, refresh: fetchWeather };
} 