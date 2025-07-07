/**
 * Servicio para manejar las peticiones a la API de telemetría
 * Basado en la documentación de Ecowitt
 */

import { 
  RealtimeRequestParams, 
  RealtimeResponse, 
  DeviceInfoRequestParams,
  DeviceInfoResponse,
  HistoryRequestParams,
  HistoryResponse,
  createRealtimeRequestParams,
  validateRealtimeRequestParams,
  DEFAULT_REALTIME_PARAMS
} from '@/types/telemetry';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 10000; // 10 segundos

/**
 * Clase principal para el servicio de telemetría
 */
export class TelemetryService {
  private apiKey: string;
  private applicationKey: string;
  private baseUrl: string;

  constructor(apiKey: string, applicationKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.applicationKey = applicationKey;
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Obtener datos en tiempo real de un dispositivo
   */
  async getRealtimeData(mac: string, params?: Partial<RealtimeRequestParams>): Promise<RealtimeResponse> {
    const requestParams = createRealtimeRequestParams(
      this.applicationKey,
      this.apiKey,
      mac,
      params
    );

    const errors = validateRealtimeRequestParams(requestParams);
    if (errors.length > 0) {
      throw new Error(`Invalid request parameters: ${errors.join(', ')}`);
    }

    const queryString = new URLSearchParams(requestParams as unknown as Record<string, string>).toString();
    const url = `${this.baseUrl}/device/real_time?${queryString}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as RealtimeResponse;
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      throw new Error(`Failed to fetch realtime data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener información de un dispositivo
   */
  async getDeviceInfo(mac: string, params?: Partial<DeviceInfoRequestParams>): Promise<DeviceInfoResponse> {
    const requestParams: DeviceInfoRequestParams = {
      application_key: this.applicationKey,
      api_key: this.apiKey,
      mac,
      ...params
    };

    const queryString = new URLSearchParams(requestParams as unknown as Record<string, string>).toString();
    const url = `${this.baseUrl}/device/info?${queryString}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as DeviceInfoResponse;
    } catch (error) {
      console.error('Error fetching device info:', error);
      throw new Error(`Failed to fetch device info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener datos históricos de un dispositivo
   */
  async getHistoryData(mac: string, params: HistoryRequestParams): Promise<HistoryResponse> {
    const requestParams: HistoryRequestParams = {
      ...params,
      application_key: this.applicationKey,
      api_key: this.apiKey,
      mac
    };

    const queryString = new URLSearchParams(requestParams as unknown as Record<string, string>).toString();
    const url = `${this.baseUrl}/device/history?${queryString}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as HistoryResponse;
    } catch (error) {
      console.error('Error fetching history data:', error);
      throw new Error(`Failed to fetch history data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtener datos de múltiples dispositivos en tiempo real
   */
  async getMultipleDevicesRealtimeData(macs: string[], params?: Partial<RealtimeRequestParams>): Promise<RealtimeResponse[]> {
    const promises = macs.map(mac => this.getRealtimeData(mac, params));
    
    try {
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Error fetching data for device ${macs[index]}:`, result.reason);
          throw new Error(`Failed to fetch data for device ${macs[index]}: ${result.reason}`);
        }
      });
    } catch (error) {
      console.error('Error fetching multiple devices data:', error);
      throw error;
    }
  }

  /**
   * Verificar el estado de conexión de un dispositivo
   */
  async checkDeviceStatus(mac: string): Promise<{ online: boolean; lastSeen?: Date }> {
    try {
      const deviceInfo = await this.getDeviceInfo(mac);
      
      // Verificar si el dispositivo está online basado en la respuesta
      const isOnline = deviceInfo.code === 0 && !!deviceInfo.data;
      
      return {
        online: isOnline,
        lastSeen: isOnline ? new Date() : undefined
      };
    } catch (error) {
      return {
        online: false
      };
    }
  }

  /**
   * Obtener estadísticas de todos los dispositivos
   */
  async getDevicesStats(macs: string[]): Promise<{
    total: number;
    online: number;
    offline: number;
    devices: Array<{ mac: string; online: boolean; lastSeen?: Date }>;
  }> {
    const statusPromises = macs.map(async (mac) => {
      const status = await this.checkDeviceStatus(mac);
      return { mac, ...status };
    });

    const results = await Promise.allSettled(statusPromises);
    const devices = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Error checking status for device ${macs[index]}:`, result.reason);
        return { mac: macs[index], online: false };
      }
    });

    const online = devices.filter(d => d.online).length;
    const offline = devices.length - online;

    return {
      total: devices.length,
      online,
      offline,
      devices
    };
  }
}

/**
 * Instancia singleton del servicio de telemetría
 */
let telemetryServiceInstance: TelemetryService | null = null;

/**
 * Obtener la instancia del servicio de telemetría
 */
export function getTelemetryService(apiKey?: string, applicationKey?: string): TelemetryService {
  if (!telemetryServiceInstance) {
    const key = apiKey || process.env.NEXT_PUBLIC_ECOWITT_API_KEY || '';
    const appKey = applicationKey || process.env.NEXT_PUBLIC_ECOWITT_APPLICATION_KEY || '';
    
    if (!key || !appKey) {
      throw new Error('API key and application key are required for telemetry service');
    }
    
    telemetryServiceInstance = new TelemetryService(key, appKey);
  }
  
  return telemetryServiceInstance;
}

/**
 * Resetear la instancia del servicio (útil para testing)
 */
export function resetTelemetryService(): void {
  telemetryServiceInstance = null;
} 