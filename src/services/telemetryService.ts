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
  TelemetryFilters,
  GroupRealtimeResponse
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
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this.baseURL}/devices`, {
        method: 'POST',
        headers,
        body: JSON.stringify(deviceData),
      });

      const data = await response.json();
      
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
        return {
          success: true,
          data: data
        };
      }

      return data;
    } catch (error) {
      throw new Error(`Error registering device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all devices for a user
   */
  async getDevices(filters?: TelemetryFilters): Promise<ApiResponse<DeviceInfo[]>> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (filters?.deviceType) params.append('deviceType', filters.deviceType);
      if (filters?.userId) params.append('userId', filters.userId);

      const response = await fetch(`${this.baseURL}/devices?${params.toString()}`, {
        method: 'GET',
        headers,
      });

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
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DEVICE_CHARACTERISTICS(deviceId));
      const config = getRequestConfig('GET');

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch device characteristics');
      }

      // Si la respuesta no tiene la estructura esperada (success/data), la envuelve
      if (data.success === undefined) {
        return {
          success: true,
          data: data
        };
      }

      return data;
    } catch (error) {
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
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/devices/${deviceId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar diferentes tipos de errores del backend
        let errorMessage = 'Failed to update device';
        
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

      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw new Error(`Error updating device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/devices/${deviceId}`, {
        method: 'DELETE',
        headers,
      });

      // Verificar si la respuesta tiene contenido antes de parsear JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          data = {};
        }
      } else {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete device');
      }

      return {
        success: true,
        data: undefined
      };
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
    return this.getWeatherOverview(lat, lon, units, lang);
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
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${this.baseURL}/groups`, {
        method: 'POST',
        headers,
        body: JSON.stringify(groupData),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = 'Failed to create group';
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
        // Asegurar que cada grupo tenga el campo deviceCount
        const groupsWithDeviceCount = data.map((group: any) => ({
          ...group,
          deviceCount: group.deviceCount || 0
        }));
        return { success: true, data: groupsWithDeviceCount };
      }

      if (!response.ok) {
        throw new Error(data.error || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
      }

      // Si la respuesta tiene la estructura esperada, asegurar deviceCount
      if (data.success && Array.isArray(data.data)) {
        const groupsWithDeviceCount = data.data.map((group: any) => ({
          ...group,
          deviceCount: group.deviceCount || 0
        }));
        return { ...data, data: groupsWithDeviceCount };
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

      // Asegurar que el grupo tenga el campo deviceCount
      if (data.success && data.data) {
        return {
          ...data,
          data: {
            ...data.data,
            deviceCount: data.data.deviceCount || 0
          }
        };
      }

      // Si la respuesta es directa
      if (data && !data.success) {
        return {
          success: true,
          data: {
            ...data,
            deviceCount: data.deviceCount || 0
          }
        };
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update a group
   */
  async updateGroup(groupId: string, updateData: Partial<Group>): Promise<Group> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔧 updateGroup - Request details:', {
        url: `${this.baseURL}/groups/${groupId}`,
        method: 'PUT',
        headers,
        body: updateData,
        token: token ? 'Present' : 'Missing'
      });

      const response = await fetch(`${this.baseURL}/groups/${groupId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      console.log('🔧 updateGroup - Response details:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log('🔧 updateGroup - Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update group');
      }

      return data;
    } catch (error) {
      console.error('🔧 updateGroup - Error:', error);
      throw new Error(`Error updating group: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a group
   */
  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔧 deleteGroup - Request details:', {
        url: `${this.baseURL}/groups/${groupId}`,
        method: 'DELETE',
        headers,
        token: token ? 'Present' : 'Missing'
      });

      const response = await fetch(`${this.baseURL}/groups/${groupId}`, {
        method: 'DELETE',
        headers,
      });

      console.log('🔧 deleteGroup - Response details:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      // Para DELETE con status 204, no hay contenido JSON
      if (response.status === 204) {
        console.log('🔧 deleteGroup - Success (204 No Content)');
        return { success: true, data: undefined };
      }

      // Solo intentar parsear JSON si hay contenido
      if (response.ok) {
        return { success: true, data: undefined };
      }

      // Si hay error, intentar parsear JSON
      const data = await response.json();
      console.log('🔧 deleteGroup - Response data:', data);

      throw new Error(data.error || 'Failed to delete group');
    } catch (error) {
      console.error('🔧 deleteGroup - Error:', error);
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
  async getGroupRealtimeData(groupId: string): Promise<ApiResponse<GroupRealtimeResponse>> {
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
      // Convertir timeRange a startTime y endTime como espera el backend
      const { startTime, endTime } = this.convertTimeRangeToDates(timeRange);
      
      const url = buildApiUrl('/compare/history');
      const config = getRequestConfig('POST', { 
        deviceIds,
        startTime,
        endTime,
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

  /**
   * Convert TimeRange to start and end dates
   */
  private convertTimeRangeToDates(timeRange: TimeRange): { startTime: string; endTime: string } {
    const now = new Date();
    let startTime: Date;

    switch (timeRange) {
      case 'one_hour':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'one_day':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'one_week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'one_month':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'three_months':
        startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to one day
    }

    return {
      startTime: startTime.toISOString(),
      endTime: now.toISOString()
    };
  }
}

// Export singleton instance
export const telemetryService = new TelemetryService();
export default telemetryService; 