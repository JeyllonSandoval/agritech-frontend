import { useState, useCallback, useEffect } from 'react';
import { DeviceInfo, DeviceInfoData, DeviceCharacteristicsData, Group, WeatherData } from '../types/telemetry';
import telemetryService from '../services/telemetryService';

interface UseDeviceWeatherOptions {
  device: DeviceInfo | null;
  deviceInfo: DeviceInfoData | null;
  deviceCharacteristics: DeviceCharacteristicsData | null;
  group?: Group | null;
}

export function useDeviceWeather({ device, deviceInfo, deviceCharacteristics, group }: UseDeviceWeatherOptions) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroupAverageLocation = (group: Group | null) => {
    if (!group || !(group as any).members || (group as any).members.length === 0) return null;
    const validMembers = (group as any).members.filter((m: any) => m.location && m.location.latitude && m.location.longitude);
    if (validMembers.length === 0) return null;
    const avgLat = validMembers.reduce((sum: number, m: any) => sum + m.location.latitude, 0) / validMembers.length;
    const avgLon = validMembers.reduce((sum: number, m: any) => sum + m.location.longitude, 0) / validMembers.length;
    return { latitude: avgLat, longitude: avgLon };
  };

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let lat: number | null = null;
      let lon: number | null = null;
      // 1. Buscar en deviceInfo
      if (device && typeof deviceInfo?.latitude === 'number' && typeof deviceInfo?.longitude === 'number') {
        lat = deviceInfo.latitude;
        lon = deviceInfo.longitude;
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
      }
      // 4. Si es un grupo, calcular promedio
      else if (group) {
        const avgLoc = getGroupAverageLocation(group);
        if (avgLoc) {
          lat = avgLoc.latitude;
          lon = avgLoc.longitude;
        }
      }
      if (lat == null || lon == null) {
        setError('No se pudo determinar la ubicación para obtener el clima.');
        setWeatherData(null);
        setLoading(false);
        return;
      }
      const response = await telemetryService.getWeatherOverview(lat, lon, 'metric', 'es');
      if (!response.success) {
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join('; ') 
          : response.error || 'Error al obtener datos de clima';
        throw new Error(errorMessage);
      }
      setWeatherData(response.data || null);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos de clima');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [device, deviceInfo, deviceCharacteristics, group]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weatherData, loading, error, refresh: fetchWeather };
} 