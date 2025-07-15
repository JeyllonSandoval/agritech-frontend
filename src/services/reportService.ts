// ============================================================================
// REPORT SERVICE
// Handles all API calls to the backend for report generation
// ============================================================================

import { API_CONFIG, buildApiUrl, getRequestConfig } from '../config/api';

export interface ReportRequest {
  deviceId?: string;
  groupId?: string;
  userId: string;
  includeHistory?: boolean;
  historyRange?: {
    type: 'hour' | 'day' | 'week' | 'month' | '3months';
  };
  format?: 'pdf' | 'json';
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: {
    fileID: string;
    fileName: string;
    fileURL: string;
    format: 'pdf' | 'json';
    report: {
      deviceId?: string;
      deviceName?: string;
      groupId?: string;
      groupName?: string;
      location?: {
        latitude: number;
        longitude: number;
        elevation: number;
      };
      timestamp: string;
      includeHistory?: boolean;
      hasHistoricalData?: boolean;
      historicalDataKeys?: string[];
      diagnosticPerformed?: boolean;
      timeRange?: {
        start: string;
        end: string;
        description: string;
      };
      // Para reportes de grupo
      totalDevices?: number;
      devicesWithHistoricalData?: number;
      devicesWithDiagnostic?: number;
      historicalDataSuccessRate?: number;
      diagnosticSuccessRate?: number;
    };
  };
}

export interface UserReportsResponse {
  success: boolean;
  data: Array<{
    FileID: string;
    FileName: string;
    contentURL: string;
    createdAt: string;
    status: string;
  }>;
}

class ReportService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Generate device report
   */
  async generateDeviceReport(request: ReportRequest): Promise<ReportResponse> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/api/reports/device`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error generating device report');
      }

      return data;
    } catch (error) {
      throw new Error(`Error generating device report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate group report
   */
  async generateGroupReport(request: ReportRequest): Promise<ReportResponse> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/api/reports/group`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error generating group report');
      }

      return data;
    } catch (error) {
      throw new Error(`Error generating group report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user reports
   */
  async getUserReports(userId: string): Promise<UserReportsResponse> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/api/reports/user/${userId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error fetching user reports');
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching user reports: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test report generation
   */
  async testReportGeneration(params: {
    deviceId: string;
    userId: string;
    includeHistory?: string;
    historyRange?: string;
    format?: string;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/api/reports/test?${queryParams.toString()}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error testing report generation');
      }

      return data;
    } catch (error) {
      throw new Error(`Error testing report generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download report file
   */
  async downloadReport(fileURL: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(fileURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error(`Error downloading report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const reportService = new ReportService(); 