# Telemetry Implementation

## Overview

This directory contains the telemetry system implementation for the AgriTech frontend, which provides real-time monitoring of EcoWitt devices and weather data.

## Components

### Core Components

- **TelemetryDashboard**: Main dashboard component that orchestrates all telemetry functionality
- **DeviceSelector**: Component for selecting devices and groups
- **RealtimeDataDisplay**: Displays real-time sensor data
- **WeatherDataDisplay**: Shows weather information for device locations
- **TelemetryStats**: Displays statistics and overview data
- **TelemetryControls**: Controls for polling, refresh, and other actions
- **TelemetryAlerts**: Manages and displays alerts
- **DeviceInfo**: Shows detailed device information
- **TelemetryTest**: Testing component for API endpoints

## API Integration

### Backend Endpoints

The telemetry system integrates with the following backend endpoints:

#### Devices
- `GET /devices` - Get all devices for a user
- `GET /devices/:deviceId` - Get specific device
- `GET /devices/:deviceId/info` - Get complete device info with current data
- `GET /devices/:deviceId/characteristics` - Get device characteristics from EcoWitt
- `GET /devices/:deviceId/realtime` - Get real-time data
- `GET /devices/:deviceId/history` - Get historical data
- `GET /devices/:deviceId/diagnose` - Diagnose device status
- `GET /devices/:deviceId/test` - Test device connectivity
- `GET /devices/history` - Get historical data for multiple devices
- `GET /devices/realtime` - Get real-time data for multiple devices

#### Device Groups
- `GET /users/:userId/groups` - Get all groups for a user
- `GET /groups/:groupId` - Get specific group details
- `GET /groups/:groupId/devices` - Get devices in a group
- `GET /groups/:groupId/history` - Get group historical data
- `GET /groups/:groupId/realtime` - Get group real-time data

#### Weather
- `GET /api/weather/test` - Test OpenWeather API key
- `GET /api/weather/demo` - Get demo weather data
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/timestamp` - Get weather for specific time
- `GET /api/weather/daily` - Get daily weather aggregation
- `GET /api/weather/overview` - Get weather overview with AI

#### Utility
- `GET /health` - API health check

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Development Settings
NODE_ENV=development
```

### API Configuration

The API configuration is centralized in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  ENDPOINTS: {
    // All endpoint definitions
  },
  REQUEST_CONFIG: {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  },
  // ... more configuration
};
```

## Usage

### Basic Usage

```typescript
import { useTelemetry } from '@/hooks/useTelemetry';

const MyComponent = () => {
  const {
    devices,
    groups,
    loading,
    error,
    fetchDevices,
    fetchGroups
  } = useTelemetry({
    userId: 'user-id',
    autoPoll: true,
    pollInterval: 30000
  });

  // Use the telemetry data
};
```

### Testing API Calls

Use the `TelemetryTest` component to test API endpoints:

```typescript
import TelemetryTest from '@/components/features/telemetry/TelemetryTest';

// In your component
<TelemetryTest userId="test-user-id" />
```

## State Management

The telemetry system uses React hooks for state management:

### TelemetryState Interface

```typescript
interface TelemetryState {
  devices: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  realtimeData: RealtimeData | null;
  historicalData: HistoricalResponse | null;
  weatherData: WeatherData | null;
  deviceInfo: DeviceInfoData | null;
  deviceCharacteristics: DeviceCharacteristicsData | null;
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;
  polling: boolean;
  lastUpdate: string | null;
}
```

## Error Handling

The system includes comprehensive error handling:

- Network errors
- Timeout errors
- Server errors
- Authentication errors
- Resource not found errors

## Polling

The system supports automatic polling for real-time data:

- Configurable poll interval (default: 30 seconds)
- Start/stop polling controls
- Error handling during polling
- Automatic retry logic

## Alerts

The system includes an alert system for monitoring sensor data:

- Temperature alerts (critical > 35°C, warning > 30°C)
- Humidity alerts (warning < 20%)
- Configurable thresholds
- Alert acknowledgment
- Alert history

## Development

### Running Tests

1. Start the backend server
2. Navigate to `/telemetry` page
3. Click "Show Tests" button
4. Click "Run Tests" to test API endpoints

### Debugging

- Check browser console for API configuration logs
- Use the test component to verify endpoints
- Monitor network tab for API calls
- Check error states in components

## Backend Requirements

The backend must implement the following:

1. **Authentication**: User-based access control
2. **Device Management**: CRUD operations for devices
3. **Group Management**: CRUD operations for groups
4. **EcoWitt Integration**: Real-time data from EcoWitt API
5. **Weather Integration**: OpenWeather API integration
6. **Data Storage**: Historical data storage
7. **Error Handling**: Proper error responses
8. **CORS**: Cross-origin resource sharing configuration

## API Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | string[];
}
```

## Next Steps

1. **Authentication**: Integrate with auth system
2. **Real-time Updates**: Implement WebSocket connections
3. **Data Visualization**: Add charts and graphs
4. **Export Features**: PDF/JSON report generation
5. **Mobile Support**: Responsive design improvements
6. **Performance**: Optimize for large datasets
7. **Testing**: Add unit and integration tests 