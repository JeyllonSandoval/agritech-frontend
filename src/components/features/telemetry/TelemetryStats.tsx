// ============================================================================
// TELEMETRY STATS
// Component for displaying telemetry statistics overview
// ============================================================================

import React from 'react';

interface TelemetryStatsProps {
  stats: {
    totalDevices: number;
    activeDevices: number;
    totalGroups: number;
    lastUpdate: string | null;
  };
}

const TelemetryStats: React.FC<TelemetryStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Devices */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 font-medium">Total Dispositivos</p>
            <p className="text-2xl font-bold text-white">{stats.totalDevices}</p>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Devices */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 font-medium">Dispositivos Activos</p>
            <p className="text-2xl font-bold text-white">{stats.activeDevices}</p>
          </div>
          <div className="p-3 bg-green-500/20 rounded-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Groups */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 font-medium">Grupos</p>
            <p className="text-2xl font-bold text-white">{stats.totalGroups}</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 font-medium">Última Actualización</p>
            <p className="text-sm font-medium text-white">
              {stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryStats; 