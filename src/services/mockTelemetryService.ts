/**
 * Servicio mock para probar la demo de telemetría
 * Simula las respuestas de la API de Ecowitt
 */

import { 
  RealtimeResponse, 
  DeviceInfoResponse,
  HistoryResponse,
  RealtimeData,
  OutdoorData,
  IndoorData,
  PressureData,
  WindData,
  RainfallData,
  SoilData
} from '@/types/telemetry';

// Datos simulados de sensores
const generateMockSensorData = (): RealtimeData => {
  const now = new Date();
  const baseTemp = 20 + Math.sin(Date.now() / 10000) * 5; // Temperatura variable
  const baseHumidity = 60 + Math.sin(Date.now() / 8000) * 10; // Humedad variable

  return {
    outdoor: {
      temperature: (baseTemp + Math.random() * 2).toFixed(1),
      humidity: Math.max(0, Math.min(100, baseHumidity + Math.random() * 5)).toFixed(1),
      feels_like: (baseTemp - 2 + Math.random() * 3).toFixed(1),
      dew_point: (baseTemp - 5 + Math.random() * 2).toFixed(1)
    },
    indoor: {
      temperature: (22 + Math.random() * 3).toFixed(1),
      humidity: (45 + Math.random() * 10).toFixed(1)
    },
    pressure: {
      relative: (1013 + Math.random() * 20).toFixed(1),
      absolute: (1013 + Math.random() * 20).toFixed(1)
    },
    wind: {
      wind_speed: (5 + Math.random() * 15).toFixed(1),
      wind_gust: (8 + Math.random() * 20).toFixed(1),
      wind_direction: Math.floor(Math.random() * 360)
    },
    rainfall: {
      rain_rate: (Math.random() * 2).toFixed(2),
      daily: (Math.random() * 10).toFixed(1),
      event: (Math.random() * 5).toFixed(1),
      hourly: (Math.random() * 3).toFixed(1)
    },
    solar_and_uvi: {
      solar: (800 + Math.random() * 400).toFixed(0),
      uvi: (Math.random() * 10).toFixed(1)
    },
    soil_ch1: {
      soilmoisture: (30 + Math.random() * 40).toFixed(1),
      ad: Math.floor(Math.random() * 1000)
    },
    soil_ch2: {
      soilmoisture: (25 + Math.random() * 45).toFixed(1),
      ad: Math.floor(Math.random() * 1000)
    },
    temp_humidity_ch1: {
      temperature: (18 + Math.random() * 8).toFixed(1),
      humidity: (50 + Math.random() * 20).toFixed(1)
    },
    temp_humidity_ch2: {
      temperature: (19 + Math.random() * 7).toFixed(1),
      humidity: (55 + Math.random() * 15).toFixed(1)
    }
  };
};

export class MockTelemetryService {
  private devices = [
    'A4:C1:38:XX:XX:XX',
    'B8:27:EB:XX:XX:XX', 
    'DC:A6:32:XX:XX:XX'
  ];

  /**
   * Simular delay de red
   */
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtener datos en tiempo real simulados
   */
  async getRealtimeData(mac: string): Promise<RealtimeResponse> {
    await this.delay(300 + Math.random() * 400); // Simular latencia variable

    // Simular errores ocasionales
    if (Math.random() < 0.05) { // 5% de probabilidad de error
      throw new Error('Simulated network error');
    }

    return {
      code: 0,
      msg: 'success',
      time: new Date().toISOString(),
      data: generateMockSensorData()
    };
  }

  /**
   * Obtener información de dispositivo simulada
   */
  async getDeviceInfo(mac: string): Promise<DeviceInfoResponse> {
    await this.delay(200);

    return {
      code: 0,
      msg: 'success',
      time: new Date().toISOString(),
      data: {
        id: 1,
        name: `Dispositivo ${mac.slice(-6)}`,
        mac: mac,
        type: 1, // WEATHER_STATION
        date_zone_id: 'America/Mexico_City',
        createtime: Math.floor(Date.now() / 1000) - 86400, // 1 día atrás
        longitude: -99.1332,
        latitude: 19.4326,
        stationtype: 'WS1900',
        last_update: {
          timestamp: Math.floor(Date.now() / 1000),
          status: 'online',
          sensors: {
            'outdoor_temperature': 'online',
            'outdoor_humidity': 'online',
            'pressure': 'online',
            'wind_speed': 'online',
            'rainfall': 'online',
            'soil_moisture_1': 'online',
            'soil_moisture_2': 'online'
          }
        }
      }
    };
  }

  /**
   * Obtener datos históricos simulados
   */
  async getHistoryData(mac: string, params: any): Promise<HistoryResponse> {
    await this.delay(1000);

    const dataPoints = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Últimas 24 horas

    for (let i = 0; i < 24; i++) {
      const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      dataPoints.push({
        time: time.toISOString(),
        outdoor: {
          temperature: (20 + Math.sin(i / 3) * 5 + Math.random() * 2).toFixed(1),
          humidity: Math.max(0, Math.min(100, 60 + Math.sin(i / 4) * 10 + Math.random() * 5)).toFixed(1)
        },
        pressure: {
          relative: (1013 + Math.random() * 20).toFixed(1)
        },
        wind: {
          wind_speed: (5 + Math.random() * 15).toFixed(1)
        }
      });
    }

    return {
      code: 0,
      msg: 'success',
      time: new Date().toISOString(),
      data: {
        history: dataPoints
      }
    };
  }

  /**
   * Obtener datos de múltiples dispositivos
   */
  async getMultipleDevicesRealtimeData(macs: string[]): Promise<RealtimeResponse[]> {
    const promises = macs.map(mac => this.getRealtimeData(mac));
    return Promise.all(promises);
  }

  /**
   * Verificar estado de dispositivo
   */
  async checkDeviceStatus(mac: string): Promise<{ online: boolean; lastSeen?: Date }> {
    await this.delay(100);
    
    // Simular dispositivos offline ocasionales
    const isOnline = Math.random() > 0.1; // 90% de probabilidad de estar online
    
    return {
      online: isOnline,
      lastSeen: isOnline ? new Date() : undefined
    };
  }

  /**
   * Obtener estadísticas de dispositivos
   */
  async getDevicesStats(macs: string[]): Promise<{
    total: number;
    online: number;
    offline: number;
    devices: Array<{ mac: string; online: boolean; lastSeen?: Date }>;
  }> {
    const statusPromises = macs.map(async (mac) => {
      const status = await this.checkDeviceStatus(mac);
      return { mac, ...status };
    });

    const devices = await Promise.all(statusPromises);
    const online = devices.filter(d => d.online).length;

    return {
      total: devices.length,
      online,
      offline: devices.length - online,
      devices
    };
  }
}

/**
 * Instancia singleton del servicio mock
 */
let mockTelemetryServiceInstance: MockTelemetryService | null = null;

/**
 * Obtener la instancia del servicio mock
 */
export function getMockTelemetryService(): MockTelemetryService {
  if (!mockTelemetryServiceInstance) {
    mockTelemetryServiceInstance = new MockTelemetryService();
  }
  return mockTelemetryServiceInstance;
} 