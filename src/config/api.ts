// ============================================================================
// API CONFIGURATION
// Centralized configuration for API endpoints and environment variables
// ============================================================================

// Función para determinar la URL base de la API
const getBaseUrl = (): string => {
  // Prioridad 1: Variable de entorno específica
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Prioridad 2: Variable de entorno alternativa
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  
  // Prioridad 3: URL de producción por defecto
  if (process.env.NODE_ENV === 'production') {
    return 'https://agritech-backend.vercel.app';
  }
  
  // Prioridad 4: URL de desarrollo por defecto
  return 'http://127.0.0.1:5000';
};

export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: getBaseUrl(),
  
  // API Endpoints
  ENDPOINTS: {
    // Device endpoints
    DEVICES: '/devices',
    DEVICE_INFO: (deviceId: string) => `/devices/${deviceId}/info`,
    DEVICE_CHARACTERISTICS: (deviceId: string) => `/devices/${deviceId}/characteristics`,
    DEVICE_REALTIME: (deviceId: string) => `/devices/${deviceId}/realtime`,
    DEVICE_HISTORY: (deviceId: string) => `/devices/${deviceId}/history`,
    DEVICE_DIAGNOSE: (deviceId: string) => `/devices/${deviceId}/diagnose`,
    DEVICE_TEST: (deviceId: string) => `/devices/${deviceId}/test`,
    DEVICE_DIAGNOSE_HISTORY: (deviceId: string) => `/devices/${deviceId}/diagnose-history`,
    DEVICE_TEST_HISTORY: (deviceId: string) => `/devices/${deviceId}/test-history`,
    DEVICES_HISTORY: '/devices/history',
    DEVICES_REALTIME: '/devices/realtime',
    
    // Device Groups endpoints
    DEVICE_GROUPS: '/device-groups',
    GROUP_INFO: (groupId: string) => `/groups/${groupId}`,
    USER_GROUPS: (userId: string) => `/users/${userId}/groups`,
    GROUP_DEVICES: (groupId: string) => `/groups/${groupId}/devices`,
    GROUP_HISTORY: (groupId: string) => `/groups/${groupId}/history`,
    GROUP_REALTIME: (groupId: string) => `/groups/${groupId}/realtime`,
    
    // Device Comparison endpoints
    COMPARE_REALTIME: '/compare/realtime',
    COMPARE_HISTORY: '/compare/history',
    
    // Weather endpoints
    WEATHER_TEST: '/api/weather/test',
    WEATHER_DEMO: '/api/weather/demo',
    WEATHER_CURRENT: '/api/weather/current',
    WEATHER_TIMESTAMP: '/api/weather/timestamp',
    WEATHER_DAILY: '/api/weather/daily',
    WEATHER_OVERVIEW: '/api/weather/overview',
    
    // Utility endpoints
    HEALTH: '/health',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
  },
  
  // Polling configuration
  POLLING: {
    DEFAULT_INTERVAL: 30000, // 30 seconds
    MIN_INTERVAL: 5000, // 5 seconds
    MAX_INTERVAL: 300000, // 5 minutes
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'Resource not found.',
    UNAUTHORIZED: 'Unauthorized. Please log in again.',
    FORBIDDEN: 'Access forbidden.',
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get request configuration with authentication
export const getRequestConfig = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
  const token = localStorage.getItem('token');
  
  
  
  const config: RequestInit = {
    method,
    headers: {
      ...API_CONFIG.REQUEST_CONFIG.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };
  
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }
  
  
  
  return config;
};

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Log API configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });
} 