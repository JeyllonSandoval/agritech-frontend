// ============================================================================
// USE REPORTS HOOK
// Custom hook for managing report generation
// ============================================================================

import { useState, useCallback } from 'react';
import { reportService, ReportRequest, ReportResponse, UserReportsResponse } from '../services/reportService';

interface UseReportsReturn {
  // State
  loading: boolean;
  error: string | null;
  success: string | null;
  generatedReport: ReportResponse | null;
  userReports: UserReportsResponse['data'];
  
  // Actions
  generateDeviceReport: (request: Omit<ReportRequest, 'groupId'>) => Promise<void>;
  generateGroupReport: (request: Omit<ReportRequest, 'deviceId'>) => Promise<void>;
  getUserReports: (userId: string) => Promise<void>;
  downloadReport: (fileURL: string, fileName: string) => Promise<void>;
  viewReport: (fileURL: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
  clearReport: () => void;
}

export const useReports = (): UseReportsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<ReportResponse | null>(null);
  const [userReports, setUserReports] = useState<UserReportsResponse['data']>([]);

  const generateDeviceReport = useCallback(async (request: Omit<ReportRequest, 'groupId'>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedReport(null);

    try {
      const response = await reportService.generateDeviceReport(request);
      setGeneratedReport(response);
      setSuccess(response.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al generar reporte de dispositivo');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateGroupReport = useCallback(async (request: Omit<ReportRequest, 'deviceId'>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedReport(null);

    try {
      const response = await reportService.generateGroupReport(request);
      setGeneratedReport(response);
      setSuccess(response.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al generar reporte de grupo');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReports = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reportService.getUserReports(userId);
      setUserReports(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al obtener reportes del usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadReport = useCallback(async (fileURL: string, fileName: string) => {
    try {
      await reportService.downloadReport(fileURL, fileName);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al descargar reporte');
    }
  }, []);

  const viewReport = useCallback((fileURL: string) => {
    window.open(fileURL, '_blank');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const clearReport = useCallback(() => {
    setGeneratedReport(null);
  }, []);

  return {
    // State
    loading,
    error,
    success,
    generatedReport,
    userReports,
    
    // Actions
    generateDeviceReport,
    generateGroupReport,
    getUserReports,
    downloadReport,
    viewReport,
    clearError,
    clearSuccess,
    clearReport,
  };
}; 