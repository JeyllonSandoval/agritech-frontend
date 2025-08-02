// ============================================================================
// TELEMETRY AUTH HOOK
// Hook to extract UserID from JWT token for telemetry authentication
// ============================================================================

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  UserID: string;
  Email?: string;
  FirstName?: string;
}

interface TelemetryAuth {
  userId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useTelemetryAuth = (): TelemetryAuth => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractUserId = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setUserId(null);
        return;
      }

      const decoded = jwtDecode<TokenPayload>(token);
      
      if (!decoded.UserID) {
        setError('Invalid token: UserID not found');
        setUserId(null);
        return;
      }

      setUserId(decoded.UserID);
      setError(null);
    } catch (error) {
      console.error('Error extracting UserID from token:', error);
      setError('Error decoding authentication token');
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    extractUserId();

    // Listen for token updates
    const handleTokenUpdate = () => {
      extractUserId();
    };

    window.addEventListener('loginStateChange', handleTokenUpdate);
    window.addEventListener('token-updated', handleTokenUpdate);

    return () => {
      window.removeEventListener('loginStateChange', handleTokenUpdate);
      window.removeEventListener('token-updated', handleTokenUpdate);
    };
  }, []);

  return {
    userId,
    isLoading,
    error
  };
}; 