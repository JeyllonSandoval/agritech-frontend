// ============================================================================
// USE REPORTS HOOK
// Manages report generation state and operations
// ============================================================================

import { useState, useCallback } from 'react';
import { reportService, ReportRequest, ReportResponse, UserReportsResponse } from '../services/reportService';
import { useRouter } from 'next/navigation';

export interface UseReportsReturn {
  loading: boolean;
  error: string | null;
  success: string | null;
  generatedReport: ReportResponse | null;
  userReports: UserReportsResponse['data'];
  generateDeviceReport: (request: Omit<ReportRequest, 'groupId'>) => Promise<void>;
  generateGroupReport: (request: Omit<ReportRequest, 'deviceId'>) => Promise<void>;
  getUserReports: (userId: string) => Promise<void>;
  downloadReport: (fileURL: string, fileName: string) => Promise<void>;
  viewReport: (fileURL: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearReport: () => void;
  // Nueva funcionalidad para navegar al chat creado
  navigateToChat: (chatID: string) => void;
}

export const useReports = (): UseReportsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<ReportResponse | null>(null);
  const [userReports, setUserReports] = useState<UserReportsResponse['data']>([]);
  const router = useRouter();

  const generateDeviceReport = useCallback(async (request: Omit<ReportRequest, 'groupId'>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedReport(null);

    try {
      const response = await reportService.generateDeviceReport(request);
      setGeneratedReport(response);
      setSuccess(response.message);
      
      // Si se creó un chat automático, mostrar información adicional
      if (response.data.chat) {
        setSuccess(prev => prev + ' Se ha creado un chat automático para analizar el reporte.');
      }
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
      
      // Si se creó un chat automático, mostrar información adicional
      if (response.data.chat) {
        setSuccess(prev => prev + ' Se ha creado un chat automático para analizar el reporte.');
      }
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
      setError(error instanceof Error ? error.message : 'Error al descargar el reporte');
    }
  }, []);

  const viewReport = useCallback(async (fileURL: string) => {
    try {
      await reportService.viewReport(fileURL);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al visualizar el reporte');
    }
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

  // Nueva funcionalidad para navegar al chat creado automáticamente
  const navigateToChat = useCallback((chatID: string) => {
    router.push(`/playground/chat/${chatID}`);
  }, [router]);

  return {
    loading,
    error,
    success,
    generatedReport,
    userReports,
    generateDeviceReport,
    generateGroupReport,
    getUserReports,
    downloadReport,
    viewReport,
    clearError,
    clearSuccess,
    clearReport,
    navigateToChat
  };
}; 