// ============================================================================
// TELEMETRY REPORTS
// Component for generating and viewing telemetry reports
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, TimeRange, HistoricalResponse, RealtimeData } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { DocumentChartBarIcon, CalendarIcon, ChartBarIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TelemetryReportsProps {
  devices: DeviceInfo[];
  selectedDevice?: DeviceInfo | null;
  onClose?: () => void;
}

interface ReportData {
  deviceId: string;
  deviceName: string;
  timeRange: TimeRange;
  historicalData?: HistoricalResponse;
  realtimeData?: RealtimeData;
  summary: {
    averageTemperature?: number;
    averageHumidity?: number;
    maxTemperature?: number;
    minTemperature?: number;
    totalReadings?: number;
  };
}

const TelemetryReports: React.FC<TelemetryReportsProps> = ({
  devices,
  selectedDevice,
  onClose
}) => {
  const { t } = useTranslation();
  const [selectedDevices, setSelectedDevices] = useState<DeviceInfo[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('one_day');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDeviceToggle = (device: DeviceInfo) => {
    setSelectedDevices(prev => {
      const isSelected = prev.some(d => d.DeviceID === device.DeviceID);
      if (isSelected) {
        return prev.filter(d => d.DeviceID !== device.DeviceID);
      } else {
        return [...prev, device];
      }
    });
  };

  const handleGenerateReport = async () => {
    if (selectedDevices.length === 0) {
      setError('Selecciona al menos un dispositivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reports: ReportData[] = [];

      for (const device of selectedDevices) {
        // Get historical data
        const startTime = new Date();
        const endTime = new Date();
        
        // Adjust time range
        switch (timeRange) {
          case 'one_hour':
            startTime.setHours(startTime.getHours() - 1);
            break;
          case 'one_day':
            startTime.setDate(startTime.getDate() - 1);
            break;
          case 'one_week':
            startTime.setDate(startTime.getDate() - 7);
            break;
          case 'one_month':
            startTime.setMonth(startTime.getMonth() - 1);
            break;
          case 'three_months':
            startTime.setMonth(startTime.getMonth() - 3);
            break;
        }

        const historicalResponse = await telemetryService.getHistoricalData(
          device.DeviceID,
          startTime.toISOString(),
          endTime.toISOString()
        );

        // Get realtime data
        const realtimeResponse = await telemetryService.getRealtimeData(device.DeviceID);

        // Calculate summary
        const summary = calculateSummary(historicalResponse.data, realtimeResponse.data);

        reports.push({
          deviceId: device.DeviceID,
          deviceName: device.DeviceName,
          timeRange,
          historicalData: historicalResponse.data,
          realtimeData: realtimeResponse.data,
          summary
        });
      }

      setReportData(reports);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (historicalData?: HistoricalResponse, realtimeData?: RealtimeData) => {
    const summary: ReportData['summary'] = {};

    // Calculate from realtime data
    if (realtimeData) {
      if (realtimeData.indoor?.temperature?.value) {
        const temp = parseFloat(realtimeData.indoor.temperature.value);
        summary.averageTemperature = temp;
        summary.maxTemperature = temp;
        summary.minTemperature = temp;
      }

      if (realtimeData.indoor?.humidity?.value) {
        summary.averageHumidity = parseFloat(realtimeData.indoor.humidity.value);
      }
    }

    // Calculate from historical data if available
    if (historicalData) {
      // This would require more complex calculations based on the historical data structure
      summary.totalReadings = 1; // Placeholder
    }

    return summary;
  };

  const handleExportReport = () => {
    if (reportData.length === 0) return;

    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    let content = '=== REPORTE DE TELEMETRÍA AGRI TECH ===\n\n';
    content += `Fecha: ${new Date().toLocaleString()}\n`;
    content += `Rango de tiempo: ${timeRange}\n`;
    content += `Dispositivos: ${selectedDevices.length}\n\n`;

    reportData.forEach((report, index) => {
      content += `--- DISPOSITIVO ${index + 1}: ${report.deviceName} ---\n`;
      content += `ID: ${report.deviceId}\n`;
      
      if (report.summary.averageTemperature !== undefined) {
        content += `Temperatura promedio: ${report.summary.averageTemperature}°C\n`;
      }
      if (report.summary.averageHumidity !== undefined) {
        content += `Humedad promedio: ${report.summary.averageHumidity}%\n`;
      }
      if (report.summary.maxTemperature !== undefined) {
        content += `Temperatura máxima: ${report.summary.maxTemperature}°C\n`;
      }
      if (report.summary.minTemperature !== undefined) {
        content += `Temperatura mínima: ${report.summary.minTemperature}°C\n`;
      }
      content += '\n';
    });

    return content;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DocumentChartBarIcon className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">
            Reportes de Telemetría
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Configuration */}
      <div className="space-y-4 mb-6">
        {/* Device Selection */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">
            Seleccionar Dispositivos ({selectedDevices.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {devices.map(device => {
              const isSelected = selectedDevices.some(d => d.DeviceID === device.DeviceID);
              return (
                <button
                  key={device.DeviceID}
                  onClick={() => handleDeviceToggle(device)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <div>
                    <h4 className="font-medium text-sm">{device.DeviceName}</h4>
                    <p className="text-xs opacity-70">{device.DeviceType}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Range Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Rango de Tiempo
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="w-full text-lg px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="one_hour" className="text-lg bg-black text-emerald-600">1 Hora</option>
            <option value="one_day" className="text-lg bg-black text-emerald-600">1 Día</option>
            <option value="one_week" className="text-lg bg-black text-emerald-600">1 Semana</option>
            <option value="one_month" className="text-lg bg-black text-emerald-600">1 Mes</option>
            <option value="three_months" className="text-lg bg-black text-emerald-600">3 Meses</option>
          </select>
        </div>

        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Reporte
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setReportType('summary')}
              className={`px-3 py-2 rounded-lg transition-all text-lg ${
                reportType === 'summary'
                  ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                  : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setReportType('detailed')}
              className={`px-3 py-2 rounded-lg transition-all text-lg ${
                reportType === 'detailed'
                  ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                  : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
              }`}
            >
              Detallado
            </button>
            <button
              onClick={() => setReportType('comparison')}
              className={`px-3 py-2 rounded-lg transition-all text-lg ${
                reportType === 'comparison'
                  ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
                  : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
              }`}
            >
              Comparación
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={loading || selectedDevices.length === 0}
          className="w-full text-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all"
        >
          <ChartBarIcon className="w-5 h-5" />
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>

      {/* Report Results */}
      {reportData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Resultados del Reporte
            </h3>
            <button
              onClick={handleExportReport}
              className="px-3 py-2 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              Exportar
            </button>
          </div>

          <div className="space-y-4">
            {reportData.map((report, index) => (
              <div
                key={report.deviceId}
                className="bg-white/5 border text-lg border-white/20 rounded-lg p-4"
              >
                <h4 className="font-medium text-white mb-3">{report.deviceName}</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {report.summary.averageTemperature !== undefined && (
                    <div className="text-center">
                      <p className="text-sm text-white/70">Temperatura Promedio</p>
                      <p className="text-lg font-semibold text-white">
                        {report.summary.averageTemperature.toFixed(1)}°C
                      </p>
                    </div>
                  )}
                  
                  {report.summary.averageHumidity !== undefined && (
                    <div className="text-center">
                      <p className="text-sm text-white/70">Humedad Promedio</p>
                      <p className="text-lg font-semibold text-white">
                        {report.summary.averageHumidity.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  
                  {report.summary.maxTemperature !== undefined && (
                    <div className="text-center">
                      <p className="text-sm text-white/70">Temperatura Máxima</p>
                      <p className="text-lg font-semibold text-white">
                        {report.summary.maxTemperature.toFixed(1)}°C
                      </p>
                    </div>
                  )}
                  
                  {report.summary.minTemperature !== undefined && (
                    <div className="text-center">
                      <p className="text-sm text-white/70">Temperatura Mínima</p>
                      <p className="text-lg font-semibold text-white">
                        {report.summary.minTemperature.toFixed(1)}°C
                      </p>
                    </div>
                  )}
                </div>

                {report.realtimeData && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-2">Datos Actuales</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {report.realtimeData.indoor?.temperature && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Temperatura:</span>
                          <span className="text-white">
                            {report.realtimeData.indoor.temperature.value} {report.realtimeData.indoor.temperature.unit}
                          </span>
                        </div>
                      )}
                      {report.realtimeData.indoor?.humidity && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Humedad:</span>
                          <span className="text-white">
                            {report.realtimeData.indoor.humidity.value} {report.realtimeData.indoor.humidity.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryReports; 