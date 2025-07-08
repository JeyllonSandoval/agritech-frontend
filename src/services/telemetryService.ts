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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class TelemetryService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  /**
   * Register a new EcoWitt device
   */
  async registerDevice(deviceData: DeviceRegistration): Promise<ApiResponse<DeviceInfo>> {
    try {
      const response = await fetch(`${this.baseURL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register device');
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
      const params = new URLSearchParams();
      if (filters?.deviceType) params.append('deviceType', filters.deviceType);
      if (filters?.userId) params.append('userId', filters.userId);

      const response = await fetch(`${this.baseURL}/devices?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch devices');
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
      const response = await fetch(`${this.baseURL}/devices/${deviceId}`);
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
      const response = await fetch(`${this.baseURL}/devices/${deviceId}/info`);
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
      const response = await fetch(`${this.baseURL}/devices/${deviceId}/characteristics`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch device characteristics');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching device characteristics: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      const response = await fetch(`${this.baseURL}/devices/${deviceId}/realtime`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch realtime data');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching realtime data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get realtime data for multiple devices
   */
  async getMultipleRealtimeData(deviceIds: string[]): Promise<ApiResponse<Record<string, RealtimeData>>> {
    try {
      const params = new URLSearchParams();
      params.append('deviceIds', deviceIds.join(','));

      const response = await fetch(`${this.baseURL}/devices/realtime?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/devices/${deviceId}/history?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/devices/history?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/weather/current?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/weather/timestamp?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/weather/daily?${params.toString()}`);
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

      const response = await fetch(`${this.baseURL}/weather/overview?${params.toString()}`);
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
      const response = await fetch(`${this.baseURL}/users/${userId}/groups`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch groups');
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
      const response = await fetch(`${this.baseURL}/groups/${groupId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Group not found');
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

      const response = await fetch(`${this.baseURL}/groups/${groupId}/history?${params.toString()}`);
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
      const response = await fetch(`${this.baseURL}/groups/${groupId}/realtime`);
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
      const response = await fetch(`${this.baseURL}/weather/test`);
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
}

// Export singleton instance
export const telemetryService = new TelemetryService();
export default telemetryService; 