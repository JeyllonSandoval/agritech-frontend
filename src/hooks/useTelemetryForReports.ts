// ============================================================================
// USE TELEMETRY FOR REPORTS HOOK
// Simplified version of useTelemetry for report creation without auto-effects
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { telemetryService } from '../services/telemetryService';
import { useTelemetryAuth } from './useTelemetryAuth';
import {
  DeviceInfo,
  Group,
  TelemetryFilters
} from '../types/telemetry';

interface UseTelemetryForReportsOptions {
  autoPoll?: boolean;
  pollInterval?: number;
  deviceType?: string;
}

const DEFAULT_POLL_INTERVAL = 30000; // 30 seconds

export const useTelemetryForReports = (options: UseTelemetryForReportsOptions = {}) => {
  const {
    autoPoll = false,
    pollInterval = DEFAULT_POLL_INTERVAL,
    deviceType
  } = options;

  // Get UserID from authentication
  const { userId, isLoading: authLoading, error: authError } = useTelemetryAuth();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // STATE UPDATE HELPERS
  // ============================================================================

  const setLoadingState = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  const setErrorState = useCallback((error: string | null) => {
    setError(error);
  }, []);

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  const fetchDevices = useCallback(async () => {
    if (!userId) {
      setErrorState('User not authenticated');
      return;
    }

    try {
      setLoadingState(true);
      const filters: TelemetryFilters = { userId };
      if (deviceType) filters.deviceType = deviceType;

      const response = await telemetryService.getDevices(filters);
      
      if (response.success && response.data) {
        setDevices(response.data);
        setErrorState(null);
      } else {
        setErrorState(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch devices'
        );
      }
    } catch (error) {
      setErrorState(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoadingState(false);
    }
  }, [userId, deviceType, setLoadingState, setErrorState]);

  // ============================================================================
  // GROUP MANAGEMENT
  // ============================================================================

  const fetchGroups = useCallback(async () => {
    if (!userId) {
      setErrorState('User not authenticated');
      return;
    }

    try {
      setLoadingState(true);
              const response = await telemetryService.getUserGroups();
      
      if (response.success && response.data) {
        // Obtener la cantidad real de dispositivos y el array para cada grupo
        const groupsWithDevices = await Promise.all(
          response.data.map(async (group) => {
            try {
              const devicesResp = await telemetryService.getGroupDevices(group.DeviceGroupID);
              const deviceArray = devicesResp.success && Array.isArray(devicesResp.data)
                ? devicesResp.data
                : [];
              return { ...group, deviceArray };
            } catch {
              return { ...group, deviceArray: [] };
            }
          })
        );
        setGroups(groupsWithDevices);
        setErrorState(null);
      } else {
        setErrorState(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch groups'
        );
      }
    } catch (error) {
      setErrorState(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoadingState(false);
    }
  }, [userId, setLoadingState, setErrorState]);

  // ============================================================================
  // CLEAR ERROR
  // ============================================================================

  const clearError = useCallback(() => {
    setErrorState(null);
  }, [setErrorState]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    devices,
    groups,
    loading,
    error,
    fetchDevices,
    fetchGroups,
    clearError
  };
}; 