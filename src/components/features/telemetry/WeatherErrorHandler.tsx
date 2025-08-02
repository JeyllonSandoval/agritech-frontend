// ============================================================================
// WEATHER ERROR HANDLER
// Component for handling weather API errors gracefully
// ============================================================================

import React from 'react';
import { ArrowPathIcon, ExclamationTriangleIcon, CloudIcon } from '@heroicons/react/24/outline';

interface WeatherErrorHandlerProps {
  error: string | null;
  onRetry: () => void;
  isLoading?: boolean;
  className?: string;
}

const WeatherErrorHandler: React.FC<WeatherErrorHandlerProps> = ({
  error,
  onRetry,
  isLoading = false,
  className = ''
}) => {
  if (!error) return null;

  const isTimeoutError = error.toLowerCase().includes('timeout');
  const isNetworkError = error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch');

  const getErrorIcon = () => {
    if (isTimeoutError) {
      return <ExclamationTriangleIcon className="w-8 h-8 text-orange-400" />;
    }
    if (isNetworkError) {
      return <CloudIcon className="w-8 h-8 text-red-400" />;
    }
    return <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />;
  };

  const getErrorMessage = () => {
    if (isTimeoutError) {
      return "La API del clima está tardando en responder. Esto puede ser temporal.";
    }
    if (isNetworkError) {
      return "Error de conexión. Verifica tu conexión a internet.";
    }
    return "Error al obtener datos del clima. Intenta de nuevo.";
  };

  const getErrorTitle = () => {
    if (isTimeoutError) {
      return "Timeout del Servicio";
    }
    if (isNetworkError) {
      return "Error de Conexión";
    }
    return "Error del Clima";
  };

  return (
    <div className={`text-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm ${className}`}>
      <div className="text-center">
        {getErrorIcon()}
        <h3 className="text-lg font-semibold text-white mt-3 mb-2">
          {getErrorTitle()}
        </h3>
        <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
          {getErrorMessage()}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                Reintentando...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4" />
                Reintentar
              </>
            )}
          </button>
          
          {isTimeoutError && (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-200"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Recargar Página
            </button>
          )}
        </div>
        
        <div className="mt-4 text-xs text-white/50">
          <p>Detalles técnicos: {error}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherErrorHandler; 