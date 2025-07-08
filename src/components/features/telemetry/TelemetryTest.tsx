// ============================================================================
// TELEMETRY TEST COMPONENT
// Component to test backend API calls for devices and groups
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../../hooks/useTelemetry';
import { telemetryService } from '../../../services/telemetryService';

interface TelemetryTestProps {
  userId?: string;
}

const TelemetryTest: React.FC<TelemetryTestProps> = ({ userId = 'bc7a3bc4-110d-46c0-abf4-e3a58995ff4f' }) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const {
    devices,
    groups,
    loading,
    error,
    fetchDevices,
    fetchGroups
  } = useTelemetry({
    userId,
    autoPoll: false
  });

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    try {
      // Test 0: Check API base URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      addTestResult(`🔧 API Base URL: ${baseUrl}`);
      
      // Test 1: Get devices
      addTestResult('Testing GET /devices...');
      try {
        const devicesResponse = await telemetryService.getDevices({ userId });
        if (devicesResponse.success) {
          addTestResult(`✅ Devices test passed. Found ${devicesResponse.data?.length || 0} devices`);
        } else {
          addTestResult(`❌ Devices test failed: ${devicesResponse.error}`);
        }
      } catch (error) {
        addTestResult(`❌ Devices test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 2: Get user groups
      addTestResult('Testing GET /users/:userId/groups...');
      const groupsResponse = await telemetryService.getUserGroups(userId);
      if (groupsResponse.success) {
        addTestResult(`✅ Groups test passed. Found ${groupsResponse.data?.length || 0} groups`);
      } else {
        addTestResult(`❌ Groups test failed: ${groupsResponse.error}`);
      }

      // Test 3: Test weather API
      addTestResult('Testing GET /api/weather/test...');
      const weatherTest = await telemetryService.testConnection();
      if (weatherTest) {
        addTestResult('✅ Weather API test passed');
      } else {
        addTestResult('❌ Weather API test failed');
      }

      // Test 4: Test weather demo
      addTestResult('Testing GET /api/weather/demo...');
      try {
        const demoUrl = `${baseUrl}/api/weather/demo`;
        const demoResponse = await fetch(demoUrl);
        if (demoResponse.ok) {
          addTestResult('✅ Weather demo test passed');
        } else {
          addTestResult('❌ Weather demo test failed');
        }
      } catch (error) {
        addTestResult('❌ Weather demo test failed');
      }

      // Test 5: Test API status
      addTestResult('Testing GET /health...');
      const statusResponse = await telemetryService.getApiStatus();
      if (statusResponse.success) {
        addTestResult(`✅ API status test passed: ${statusResponse.data?.status}`);
      } else {
        addTestResult(`❌ API status test failed: ${statusResponse.error}`);
      }

      // Test 6: Test device diagnose (if devices exist)
      if (devices.length > 0) {
        addTestResult(`Testing GET /devices/${devices[0].DeviceID}/diagnose...`);
        try {
          const diagnoseResponse = await telemetryService.diagnoseDevice(devices[0].DeviceID);
          if (diagnoseResponse.success) {
            addTestResult('✅ Device diagnose test passed');
          } else {
            addTestResult(`❌ Device diagnose test failed: ${diagnoseResponse.error}`);
          }
        } catch (error) {
          addTestResult('❌ Device diagnose test failed');
        }
      }

      // Test 7: Test group devices (if groups exist)
      if (groups.length > 0) {
        addTestResult(`Testing GET /groups/${groups[0].DeviceGroupID}/devices...`);
        try {
          const groupDevicesResponse = await telemetryService.getGroupDevices(groups[0].DeviceGroupID);
          if (groupDevicesResponse.success) {
            addTestResult(`✅ Group devices test passed. Found ${groupDevicesResponse.data?.length || 0} devices`);
          } else {
            addTestResult(`❌ Group devices test failed: ${groupDevicesResponse.error}`);
          }
        } catch (error) {
          addTestResult('❌ Group devices test failed');
        }
      }

    } catch (error) {
      addTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Telemetry API Tests
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={isTesting}
            className="px-4 py-2 text-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Testing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run Tests
              </>
            )}
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 text-lg bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Current State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/70 mb-2">Current State</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Devices:</span>
              <span className="text-white">{devices.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Groups:</span>
              <span className="text-white">{groups.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Loading:</span>
              <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Error:</span>
              <span className={error ? 'text-red-400' : 'text-green-400'}>
                {error ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white/70 mb-2">API Info</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Base URL:</span>
              <span className="text-white">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">User ID:</span>
              <span className="text-white">{userId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-black/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white/70 mb-3">Test Results</h3>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {testResults.length === 0 ? (
            <p className="text-white/50 text-sm">No test results yet. Click "Run Tests" to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result.includes('✅') ? (
                  <span className="text-green-400">{result}</span>
                ) : result.includes('❌') ? (
                  <span className="text-red-400">{result}</span>
                ) : (
                  <span className="text-white/70">{result}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-300 font-medium">Error</span>
          </div>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TelemetryTest; 