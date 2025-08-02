'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/config/api';

export const ApiDebugInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [apiInfo, setApiInfo] = useState({
    baseUrl: '',
    nodeEnv: '',
    publicApiUrl: '',
    publicBackendUrl: ''
  });

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      setApiInfo({
        baseUrl: API_CONFIG.BASE_URL,
        nodeEnv: process.env.NODE_ENV || 'undefined',
        publicApiUrl: process.env.NEXT_PUBLIC_API_URL || 'undefined',
        publicBackendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'undefined'
      });
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2">🔧 API Debug Info</h3>
      <div className="space-y-1">
        <div><strong>NODE_ENV:</strong> {apiInfo.nodeEnv}</div>
        <div><strong>BASE_URL:</strong> {apiInfo.baseUrl}</div>
        <div><strong>NEXT_PUBLIC_API_URL:</strong> {apiInfo.publicApiUrl}</div>
        <div><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {apiInfo.publicBackendUrl}</div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 text-xs text-gray-400 hover:text-white underline"
      >
        Cerrar
      </button>
    </div>
  );
};

export default ApiDebugInfo; 