// ============================================================================
// TELEMETRY PAGE
// Main telemetry page with dashboard integration
// ============================================================================

'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../utils/protectedRoute';
import TelemetryDashboard from '../../components/features/telemetry/TelemetryDashboard';
import TelemetryTest from '../../components/features/telemetry/TelemetryTest';

const TelemetryPage: React.FC = () => {
  const [showTests, setShowTests] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Test Toggle Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowTests(!showTests)}
              className="px-4 py-2 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showTests ? 'Hide Tests' : 'Show Tests'}
            </button>
          </div>

          {/* Test Component */}
          {showTests && (
            <TelemetryTest />
          )}

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