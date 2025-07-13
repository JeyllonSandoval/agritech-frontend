// ============================================================================
// TELEMETRY SERVICE
// Handles all API calls to the backend for EcoWitt telemetry system
// ============================================================================

import {
  DeviceRegistration,
  DeviceInfo,
  RealtimeData,
  HistoricalResponse,
  WeatherData,
  DeviceInfoData,
  DeviceCharacteristicsData,
  Group,
  GroupCreation,
  TimeRange,
  ApiResponse,
  PaginatedResponse,
  TelemetryFilters
} from '../types/telemetry';
import { API_CONFIG, buildApiUrl, getRequestConfig } from '../config/api';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  UserID: string;
}

class TelemetryService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  /**
   * Register a new EcoWitt device
   */
  async registerDevice(deviceData: DeviceRegistration): Promise<ApiResponse<DeviceInfo>> {
    try {
      console.log('🔍 telemetryService - registerDevice iniciado con datos:', deviceData);
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('🔍 telemetryService - URL:', `${this.baseURL}/devices`);
      console.log('🔍 telemetryService - Headers:', headers);
      
      const response = await fetch(`${this.baseURL}/devices`, {
        method: 'POST',
        headers,
        body: JSON.stringify(deviceData),
      });

      const data = await response.json();
      
      console.log('🔍 telemetryService - Response status:', response.status);
      console.log('🔍 telemetryService - Response data:', data);
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores del backend
        let errorMessage = 'Failed to register device';
        
        if (data.error) {
          if (Array.isArray(data.error)) {
            errorMessage = data.error.join('; ');
          } else {
            errorMessage = data.error;
          }
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.details) {
          errorMessage = Array.isArray(data.details) 
            ? data.details.map((d: any) => d.message).join('; ')
            : data.details;
        }
        
        throw new Error(errorMessage);
      }

      // Si la respuesta no tiene la estructura esperada, la envuelve
      if (data.success === undefined) {
        console.log('🔍 telemetryService - Envuelviendo respuesta directa del backend');
        return {
          success: true,
          data: data
        };
      }

      return data;
    } catch (error) {
      console.error('❌ telemetryService - Error en registerDevice:', error);
      throw new Error(`Error registering device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all devices for a user
   */
  async getDevices(filters?: TelemetryFilters): Promise<ApiResponse<DeviceInfo[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.deviceType) params.append('deviceType', filters.deviceType);
      if (filters?.userId) params.append('userId', filters.userId);

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.DEVICES}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      // Adaptar si la respuesta es un array directo
      if (Array.isArray(data)) {
        return { success: true, data };
      }

      if (!response.ok) {
        throw new Error(data.error || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching devices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get specific device information
   */
  async getDevice(deviceId: string): Promise<ApiResponse<DeviceInfo>> {
    try {
      const response = await fetch(`${this.baseURL}/devices/${deviceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Device not found');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get complete device information including current data
   */
  async getDeviceInfo(deviceId: string): Promise<ApiResponse<DeviceInfoData>> {
    try {
      const response = await fetch(`${this.baseURL}/devices/${deviceId}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch device info');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching device info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get device characteristics from EcoWitt
   */
  async getDeviceCharacteristics(deviceId: string): Promise<ApiResponse<DeviceCharacteristicsData>> {
    console.log('🔍 telemetryService - getDeviceCharacteristics iniciado para deviceId:', deviceId);
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DEVICE_CHARACTERISTICS(deviceId));
      const config = getRequestConfig('GET');
      
      console.log('🔍 telemetryService - URL construida:', url);
      console.log('🔍 telemetryService - Config de request:', config);

      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('🔍 telemetryService - Response status:', response.status);
      console.log('🔍 telemetryService - Response data:', data);

      if (!response.ok) {
        console.log('🔍 telemetryService - Error en response:', data.error);
        throw new Error(data.error || 'Failed to fetch device characteristics');
      }

      // Si la respuesta no tiene la estructura esperada (success/data), la envuelve
      if (data.success === undefined) {
        console.log('🔍 telemetryService - Envuelviendo respuesta directa del backend');
        return {
          success: true,
          data: data
        };
      }

      console.log('🔍 telemetryService - Respuesta exitosa:', data);
      return data;
    } catch (error) {
      console.log('🔍 telemetryService - Error en getDeviceCharacteristics:', error);
      throw new Error(`Error fetching device characteristics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Diagnose device status
   */
  async diagnoseDevice(deviceId: string): Promise<ApiResponse<any>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DEVICE_DIAGNOSE(deviceId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to diagnose device');
      }

      return data;
    } catch (error) {
      throw new Error(`Error diagnosing device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test device connectivity
   */
  async testDevice(deviceId: string): Promise<ApiResponse<any>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DEVICE_TEST(deviceId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test device');
      }

      return data;
    } catch (error) {
      throw new Error(`Error testing device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get devices in a group
   */
  async getGroupDevices(groupId: string): Promise<ApiResponse<DeviceInfo[]>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GROUP_DEVICES(groupId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch group devices');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching group devices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update device information
   */
  async updateDevice(deviceId: string, updateData: Partial<DeviceInfo>): Promise<ApiResponse<DeviceInfo>> {
    try {
      const response = await fetch(`${this.baseURL}/devices/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update device');
      }

      return data;
    } catch (error) {
      throw new Error(`Error updating device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseURL}/devices/${deviceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete device');
      }

      return data;
    } catch (error) {
      throw new Error(`Error deleting device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // REALTIME DATA
  // ============================================================================

  /**
   * Get realtime data for a specific device
   */
  async getRealtimeData(deviceId: string): Promise<ApiResponse<RealtimeData>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DEVICE_REALTIME(deviceId));
      const config = getRequestConfig();
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (response.ok) {
        // Handle both new and legacy response formats
        if (data.code === 0 && data.data) {
          // New format with code/msg/time structure
          return {
            success: true,
            data: data.data
          };
        } else if (data.success !== undefined) {
          // Legacy format with success field
          return {
            success: data.success,
            data: data.data,
            error: data.error
          };
        } else {
          // Direct data format
          return {
            success: true,
            data: data
          };
        }
      } else {
        return {
          success: false,
          error: data.message || 'Failed to fetch realtime data'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get realtime data for multiple devices
   */
  async getMultipleRealtimeData(deviceIds: string[]): Promise<ApiResponse<Record<string, RealtimeData>>> {
    try {
      const params = new URLSearchParams();
      params.append('deviceIds', deviceIds.join(','));

      const response = await fetch(`${this.baseURL}/devices/realtime?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch realtime data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching realtime data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // HISTORICAL DATA
  // ============================================================================

  /**
   * Get historical data for a specific device
   */
  async getHistoricalData(
    deviceId: string, 
    startTime: string, 
    endTime: string
  ): Promise<ApiResponse<HistoricalResponse>> {
    try {
      const params = new URLSearchParams({
        startTime,
        endTime,
      });

      const response = await fetch(`${this.baseURL}/devices/${deviceId}/history?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch historical data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get historical data for multiple devices
   */
  async getMultipleHistoricalData(
    deviceIds: string[], 
    rangeType: TimeRange
  ): Promise<ApiResponse<Record<string, HistoricalResponse>>> {
    try {
      const params = new URLSearchParams({
        deviceIds: deviceIds.join(','),
        rangeType,
      });

      const response = await fetch(`${this.baseURL}/devices/history?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch historical data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // WEATHER DATA
  // ============================================================================

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather(lat: number, lon: number, units: string = 'metric', lang: string = 'es'): Promise<ApiResponse<WeatherData>> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        units,
        lang,
      });

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WEATHER_CURRENT}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get weather data for a specific timestamp
   */
  async getWeatherByTimestamp(lat: number, lon: number, dt: number, units: string = 'metric'): Promise<ApiResponse<WeatherData>> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        dt: dt.toString(),
        units,
      });

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WEATHER_TIMESTAMP}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get daily weather aggregation
   */
  async getDailyWeather(lat: number, lon: number, start: number, end: number, units: string = 'metric'): Promise<ApiResponse<WeatherData>> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        start: start.toString(),
        end: end.toString(),
        units,
      });

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WEATHER_DAILY}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get weather overview with AI
   */
  async getWeatherOverview(lat: number, lon: number, units: string = 'metric', lang: string = 'es'): Promise<ApiResponse<WeatherData>> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        units,
        lang,
      });

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.WEATHER_OVERVIEW}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather overview');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching weather overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // GROUP MANAGEMENT
  // ============================================================================

  /**
   * Create a new device group
   */
  async createGroup(groupData: GroupCreation): Promise<ApiResponse<Group>> {
    try {
      const response = await fetch(`${this.baseURL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }

      return data;
    } catch (error) {
      throw new Error(`Error creating group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all groups for a user
   */
  async getUserGroups(userId: string): Promise<ApiResponse<Group[]>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_GROUPS(userId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      // Adaptar si la respuesta es un array directo
      if (Array.isArray(data)) {
        return { success: true, data };
      }

      if (!response.ok) {
        throw new Error(data.error || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching groups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get specific group details
   */
  async getGroup(groupId: string): Promise<ApiResponse<Group>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GROUP_INFO(groupId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || API_CONFIG.ERROR_MESSAGES.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update a group
   */
  async updateGroup(groupId: string, updateData: Partial<Group>): Promise<ApiResponse<Group>> {
    try {
      const response = await fetch(`${this.baseURL}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update group');
      }

      return data;
    } catch (error) {
      throw new Error(`Error updating group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseURL}/groups/${groupId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete group');
      }

      return data;
    } catch (error) {
      throw new Error(`Error deleting group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get historical data for a group
   */
  async getGroupHistoricalData(groupId: string, rangeType: TimeRange): Promise<ApiResponse<Record<string, HistoricalResponse>>> {
    try {
      const params = new URLSearchParams({
        rangeType,
      });

      const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.GROUP_HISTORY(groupId)}?${params.toString()}`);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch group historical data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching group historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get realtime data for a group
   */
  async getGroupRealtimeData(groupId: string): Promise<ApiResponse<Record<string, RealtimeData>>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GROUP_REALTIME(groupId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch group realtime data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching group realtime data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.WEATHER_TEST);
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API status
   */
  async getApiStatus(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API not available');
      }

      return data;
    } catch (error) {
      throw new Error(`Error checking API status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // DEVICE COMPARISON METHODS
  // ============================================================================

  /**
   * Compare real-time data between multiple devices
   */
  async compareDevicesRealtime(deviceIds: string[]): Promise<ApiResponse<any>> {
    try {
      const url = buildApiUrl('/compare/realtime');
      const config = getRequestConfig('POST', { deviceIds });

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare devices');
      }

      return data;
    } catch (error) {
      throw new Error(`Error comparing devices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compare historical data between multiple devices
   */
  async compareDevicesHistory(deviceIds: string[], timeRange: TimeRange): Promise<ApiResponse<any>> {
    try {
      const url = buildApiUrl('/compare/history');
      const config = getRequestConfig('POST', { 
        deviceIds,
        timeRange 
      });

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare historical data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error comparing historical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const telemetryService = new TelemetryService();
export default telemetryService; 