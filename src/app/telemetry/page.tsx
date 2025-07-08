// ============================================================================
// TELEMETRY PAGE
// Main telemetry page with dashboard integration
// ============================================================================

'use client';

import React from 'react';
import TelemetryDashboard from '../../components/features/telemetry/TelemetryDashboard';

const TelemetryPage: React.FC = () => {
  // TODO: Get actual user ID from authentication context
  const userId = '550e8400-e29b-41d4-a716-446655440000'; // Mock user ID for now

  return (
    <TelemetryDashboard
      userId={userId}
      autoPoll={true}
      pollInterval={30000}
    />
  );
};

export default TelemetryPage; 