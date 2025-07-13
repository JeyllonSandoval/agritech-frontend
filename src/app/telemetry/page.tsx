// ============================================================================
// TELEMETRY PAGE
// Main telemetry page with dashboard integration
// ============================================================================

'use client';

import React, { useEffect } from 'react';
import ProtectedRoute from '../../utils/protectedRoute';
import TelemetryDashboard from '../../components/features/telemetry/TelemetryDashboard';
import { showSuccessToast } from '@/components/common/SuccessToast';

const TelemetryPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('showGroupCreatedToast')) {
        showSuccessToast('¡El grupo fue creado satisfactoriamente!');
        localStorage.removeItem('showGroupCreatedToast');
      } else if (localStorage.getItem('showDeviceCreatedToast')) {
        showSuccessToast('¡El dispositivo fue creado satisfactoriamente!');
        localStorage.removeItem('showDeviceCreatedToast');
      }
    }
  }, []);

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