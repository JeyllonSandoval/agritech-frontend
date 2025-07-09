// ============================================================================
// TELEMETRY PAGE
// Main telemetry page with dashboard integration
// ============================================================================

'use client';

import React from 'react';
import ProtectedRoute from '../../utils/protectedRoute';
import TelemetryDashboard from '../../components/features/telemetry/TelemetryDashboard';

const TelemetryPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Main Dashboard */}
          <TelemetryDashboard
            autoPoll={true}
            pollInterval={30000}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TelemetryPage; 