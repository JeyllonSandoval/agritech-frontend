'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTelemetry } from '@/hooks/useTelemetry';
import { telemetryService } from '@/services/telemetryService';
import { DeviceInfo, Group } from '@/types/telemetry';
import { 
  DevicePhoneMobileIcon, 
  UsersIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  SparklesIcon,
  SignalIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface ChatDeviceSelectorProps {
  onDeviceDataSend: (deviceData: string) => void;
  onClose: () => void;
}

const ChatDeviceSelector: React.FC<ChatDeviceSelectorProps> = ({
  onDeviceDataSend,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'groups'>('devices');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Hooks
  const {
    devices,
    groups,
    loading,
    error,
    fetchDevices,
    fetchGroups,
    fetchDeviceInfo,
    fetchDeviceCharacteristics,
    fetchRealtimeData
  } = useTelemetry({ autoPoll: false });

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar que el token esté disponible
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('🔍 [ChatDeviceSelector] No hay token disponible');
          return;
        }
        
        console.log('🔍 [ChatDeviceSelector] Iniciando carga de datos...');
        await Promise.all([
          fetchDevices(),
          fetchGroups()
        ]);
        console.log('🔍 [ChatDeviceSelector] Datos cargados exitosamente');
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    // Pequeño delay para asegurar que la autenticación esté lista
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchDevices, fetchGroups]);

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  // Obtener tipos únicos de dispositivos
  const deviceTypes = useMemo(() => {
    const types = [...new Set(devices.map(device => device.DeviceType))];
    return types.sort();
  }, [devices]);

  // Filtrar dispositivos por tipo y búsqueda
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesType = deviceTypeFilter === 'all' || device.DeviceType === deviceTypeFilter;
      const matchesSearch = searchTerm === '' || 
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [devices, deviceTypeFilter, searchTerm]);

  // Filtrar grupos por búsqueda
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      return searchTerm === '' || 
        group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [groups, searchTerm]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDeviceSelect = async (device: DeviceInfo) => {
    setSelectedDevice(device);
    setSelectedGroup(null);
    setIsLoadingData(true);
    
    try {
      // Obtener datos completos del dispositivo usando el servicio directamente
      const [deviceInfoResponse, deviceCharacteristicsResponse, realtimeDataResponse] = await Promise.all([
        telemetryService.getDeviceInfo(device.DeviceID),
        telemetryService.getDeviceCharacteristics(device.DeviceID),
        telemetryService.getRealtimeData(device.DeviceID)
      ]);

      // Extraer los datos de las respuestas
      const deviceInfo = deviceInfoResponse.success ? deviceInfoResponse.data : null;
      const deviceCharacteristics = deviceCharacteristicsResponse.success ? deviceCharacteristicsResponse.data : null;
      const realtimeData = realtimeDataResponse.success ? realtimeDataResponse.data : null;

      console.log('🔍 [ChatDeviceSelector] Respuestas del servicio:', {
        deviceInfoResponse: {
          success: deviceInfoResponse.success,
          hasData: !!deviceInfoResponse.data,
          dataKeys: deviceInfoResponse.data ? Object.keys(deviceInfoResponse.data) : []
        },
        deviceCharacteristicsResponse: {
          success: deviceCharacteristicsResponse.success,
          hasData: !!deviceCharacteristicsResponse.data,
          dataKeys: deviceCharacteristicsResponse.data ? Object.keys(deviceCharacteristicsResponse.data) : []
        },
        realtimeDataResponse: {
          success: realtimeDataResponse.success,
          hasData: !!realtimeDataResponse.data,
          dataKeys: realtimeDataResponse.data ? Object.keys(realtimeDataResponse.data) : []
        }
      });

      console.log('🔍 [ChatDeviceSelector] Datos obtenidos:', {
        deviceInfo: deviceInfo ? 'Presente' : 'Ausente',
        deviceCharacteristics: deviceCharacteristics ? 'Presente' : 'Ausente',
        realtimeData: realtimeData ? 'Presente' : 'Ausente',
        realtimeDataKeys: realtimeData ? Object.keys(realtimeData) : []
      });

      // Log detallado de los datos en tiempo real
      if (realtimeData) {
        console.log('🔍 [ChatDeviceSelector] Estructura de realtimeData:', {
          indoor: realtimeData.indoor ? 'Presente' : 'Ausente',
          pressure: realtimeData.pressure ? 'Presente' : 'Ausente',
          soil_ch1: realtimeData.soil_ch1 ? 'Presente' : 'Ausente',
          soil_ch9: realtimeData.soil_ch9 ? 'Presente' : 'Ausente',
          battery: realtimeData.battery ? 'Presente' : 'Ausente',
          // Datos legacy
          temperature: realtimeData.temperature,
          humidity: realtimeData.humidity,
          pressureValue: realtimeData.pressureValue,
          windSpeed: realtimeData.windSpeed,
          windDirection: realtimeData.windDirection,
          rainfall: realtimeData.rainfall,
          uv: realtimeData.uv,
          solarRadiation: realtimeData.solarRadiation
        });

        // Log de datos específicos si están disponibles
        if (realtimeData.indoor) {
          console.log('🔍 [ChatDeviceSelector] Datos interiores:', realtimeData.indoor);
        }
        if (realtimeData.pressure) {
          console.log('🔍 [ChatDeviceSelector] Datos de presión:', realtimeData.pressure);
        }
        if (realtimeData.soil_ch1) {
          console.log('🔍 [ChatDeviceSelector] Datos de suelo CH1:', realtimeData.soil_ch1);
        }
        if (realtimeData.battery) {
          console.log('🔍 [ChatDeviceSelector] Datos de batería:', realtimeData.battery);
        }
      }

      // Formatear los datos para enviar al chat
      const deviceData = formatDeviceDataForChat(device, deviceInfo, deviceCharacteristics, realtimeData);
      
      console.log('🔍 [ChatDeviceSelector] Datos formateados para enviar:', deviceData);
      
      // Test: Verificar que los datos se envían correctamente
      console.log('🔍 [ChatDeviceSelector] Enviando datos del dispositivo:', {
        deviceName: device.DeviceName,
        dataLength: deviceData.length,
        containsDeviceData: deviceData.includes('Datos del Dispositivo:'),
        containsRealtimeData: deviceData.includes('Datos en Tiempo Real:')
      });
      
      onDeviceDataSend(deviceData);
      
      // No cerrar el selector automáticamente para permitir selecciones adicionales
      // onClose();
    } catch (error) {
      console.error('Error fetching device data:', error);
      // Enviar datos básicos si hay error
      const basicData = formatBasicDeviceData(device);
      onDeviceDataSend(basicData);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGroupSelect = async (group: Group) => {
    setSelectedGroup(group);
    setSelectedDevice(null);
    setIsLoadingData(true);
    
    try {
      console.log('🔍 [ChatDeviceSelector] Seleccionando grupo:', group.GroupName);
      
      // 1. Obtener dispositivos del grupo
      const groupDevicesResponse = await telemetryService.getGroupDevices(group.DeviceGroupID);
      
      console.log('🔍 [ChatDeviceSelector] Respuesta de dispositivos del grupo:', {
        groupName: group.GroupName,
        success: groupDevicesResponse.success,
        hasData: !!groupDevicesResponse.data,
        dataType: Array.isArray(groupDevicesResponse.data) ? 'array' : typeof groupDevicesResponse.data,
        dataLength: Array.isArray(groupDevicesResponse.data) ? groupDevicesResponse.data.length : 'N/A',
        rawData: groupDevicesResponse.data
      });
      
      // Manejar diferentes formatos de respuesta como en useTelemetry
      let deviceArray: any[] = [];
      
      if (groupDevicesResponse.success && Array.isArray(groupDevicesResponse.data)) {
        deviceArray = groupDevicesResponse.data;
      } else if (Array.isArray(groupDevicesResponse)) {
        // Si la respuesta es directamente un array
        deviceArray = groupDevicesResponse;
      } else if (groupDevicesResponse.data && Array.isArray(groupDevicesResponse.data)) {
        // Si la respuesta tiene data como array
        deviceArray = groupDevicesResponse.data;
      } else if (groupDevicesResponse && Array.isArray(groupDevicesResponse)) {
        // Si la respuesta es directamente un array sin estructura
        deviceArray = groupDevicesResponse;
      }
      
      console.log('🔍 [ChatDeviceSelector] Array de dispositivos extraído:', deviceArray);
      
      const deviceIds = deviceArray.length > 0
        ? deviceArray.map((d: any) => d.DeviceID || d.deviceId || d.id).filter(Boolean)
        : [];

      console.log('🔍 [ChatDeviceSelector] Dispositivos del grupo:', {
        groupName: group.GroupName,
        deviceIds: deviceIds,
        deviceCount: deviceIds.length
      });

      if (deviceIds.length === 0) {
        console.warn('🔍 [ChatDeviceSelector] No hay dispositivos en el grupo');
        const basicGroupData = formatBasicGroupData(group);
        onDeviceDataSend(basicGroupData);
        return;
      }

      // 2. Obtener información, características y datos en tiempo real de cada dispositivo
      const deviceInfoPromises = deviceIds.map(async (deviceId) => {
        try {
          const [deviceInfoResponse, deviceCharacteristicsResponse, realtimeDataResponse] = await Promise.all([
            telemetryService.getDeviceInfo(deviceId),
            telemetryService.getDeviceCharacteristics(deviceId),
            telemetryService.getRealtimeData(deviceId) // Obtener datos en tiempo real individuales
          ]);

          return {
            deviceId,
            deviceInfo: deviceInfoResponse.success ? deviceInfoResponse.data : null,
            deviceCharacteristics: deviceCharacteristicsResponse.success ? deviceCharacteristicsResponse.data : null,
            realtimeData: realtimeDataResponse.success ? realtimeDataResponse.data : null
          };
        } catch (error) {
          console.error(`Error obteniendo datos del dispositivo ${deviceId}:`, error);
          return {
            deviceId,
            deviceInfo: null,
            deviceCharacteristics: null,
            realtimeData: null
          };
        }
      });

      const deviceDataResults = await Promise.all(deviceInfoPromises);

      console.log('🔍 [ChatDeviceSelector] Datos de dispositivos del grupo:', {
        groupName: group.GroupName,
        devicesWithData: deviceDataResults.filter(d => d.deviceInfo || d.deviceCharacteristics || d.realtimeData).length,
        totalDevices: deviceDataResults.length
      });

      // 4. Formatear los datos del grupo para enviar al chat
      console.log('🔍 [ChatDeviceSelector] Datos que se pasan a formatGroupDataForChat:', {
        groupName: group.GroupName,
        deviceDataResults: deviceDataResults.map(d => ({
          deviceId: d.deviceId,
          hasDeviceInfo: !!d.deviceInfo,
          hasDeviceCharacteristics: !!d.deviceCharacteristics,
          hasRealtimeData: !!d.realtimeData,
          realtimeDataKeys: d.realtimeData ? Object.keys(d.realtimeData) : []
        }))
      });
      
      const groupData = formatGroupDataForChat(group, deviceDataResults);
      
      console.log('🔍 [ChatDeviceSelector] Datos del grupo formateados para enviar:', {
        groupName: group.GroupName,
        dataLength: groupData.length,
        containsGroupData: groupData.includes('Datos del Grupo:'),
        containsRealtimeData: groupData.includes('Datos en Tiempo Real:'),
        dataPreview: groupData.substring(0, 200) + '...'
      });
      
      onDeviceDataSend(groupData);
      
      // No cerrar el selector automáticamente para permitir selecciones adicionales
      // onClose();
    } catch (error) {
      console.error('Error obteniendo datos del grupo:', error);
      const basicGroupData = formatBasicGroupData(group);
      onDeviceDataSend(basicGroupData);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleClearFilters = () => {
    setDeviceTypeFilter('all');
    setSearchTerm('');
  };

  const handleDeviceTypeFilterChange = (type: string) => {
    setDeviceTypeFilter(type);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // ============================================================================
  // DATA FORMATTING
  // ============================================================================

  const formatDeviceDataForChat = (device: DeviceInfo, deviceInfo: any, deviceCharacteristics: any, realtimeData: any) => {
    let data = `Datos del Dispositivo: ${device.DeviceName}\n\n`;
    
    // Información básica del dispositivo
    data += `Información General:\n`;
    data += `- Nombre: ${device.DeviceName}\n`;
    data += `- Tipo: ${device.DeviceType}\n`;
    data += `- Estado: ${device.status}\n\n`;

    // Información de ubicación si está disponible
    if (deviceInfo?.latitude && deviceInfo?.longitude) {
      data += `Ubicación:\n`;
      data += `- Coordenadas: ${deviceInfo.latitude}°, ${deviceInfo.longitude}°\n`;
      if (deviceInfo.elevation) {
        data += `- Elevación: ${deviceInfo.elevation}m\n`;
      }
      data += `\n`;
    }

    // Datos en tiempo real
    if (realtimeData) {
      data += `Datos en Tiempo Real:\n`;
      
      // Sensores interiores
      if (realtimeData.indoor) {
        if (realtimeData.indoor.temperature) {
          const temp = realtimeData.indoor.temperature;
          const value = typeof temp === 'object' ? temp.value : temp;
          const time = typeof temp === 'object' ? temp.time : Date.now();
          data += `- Temperatura Interior: ${value}°C (${new Date(time * 1000).toLocaleTimeString()})\n`;
        }
        if (realtimeData.indoor.humidity) {
          const hum = realtimeData.indoor.humidity;
          const value = typeof hum === 'object' ? hum.value : hum;
          const time = typeof hum === 'object' ? hum.time : Date.now();
          data += `- Humedad Interior: ${value}% (${new Date(time * 1000).toLocaleTimeString()})\n`;
        }
      }

      // Sensores de presión
      if (realtimeData.pressure) {
        if (realtimeData.pressure.relative) {
          const rel = realtimeData.pressure.relative;
          data += `- Presión Relativa: ${rel.value} ${rel.unit} (${new Date(rel.time * 1000).toLocaleTimeString()})\n`;
        }
        if (realtimeData.pressure.absolute) {
          const abs = realtimeData.pressure.absolute;
          data += `- Presión Absoluta: ${abs.value} ${abs.unit} (${new Date(abs.time * 1000).toLocaleTimeString()})\n`;
        }
      }

      // Sensores de suelo CH1
      if (realtimeData.soil_ch1) {
        if (realtimeData.soil_ch1.soilmoisture) {
          const soil = realtimeData.soil_ch1.soilmoisture;
          data += `- Humedad del Suelo CH1: ${soil.value} ${soil.unit} (${new Date(soil.time * 1000).toLocaleTimeString()})\n`;
        }
        if (realtimeData.soil_ch1.ad) {
          const ad = realtimeData.soil_ch1.ad;
          data += `- Señal Analógica CH1: ${ad.value} ${ad.unit} (${new Date(ad.time * 1000).toLocaleTimeString()})\n`;
        }
      }

      // Sensores de suelo CH9
      if (realtimeData.soil_ch9) {
        if (realtimeData.soil_ch9.soilmoisture) {
          const soil = realtimeData.soil_ch9.soilmoisture;
          data += `- Humedad del Suelo CH9: ${soil.value} ${soil.unit} (${new Date(soil.time * 1000).toLocaleTimeString()})\n`;
        }
        if (realtimeData.soil_ch9.ad) {
          const ad = realtimeData.soil_ch9.ad;
          data += `- Señal Analógica CH9: ${ad.value} ${ad.unit} (${new Date(ad.time * 1000).toLocaleTimeString()})\n`;
        }
      }

      // Sensores de batería
      if (realtimeData.battery && realtimeData.battery.soilmoisture_sensor_ch1) {
        const battery = realtimeData.battery.soilmoisture_sensor_ch1;
        data += `- Batería Sensor Suelo: ${battery.value} ${battery.unit} (${new Date(battery.time * 1000).toLocaleTimeString()})\n`;
      }

      // Datos legacy (formato anterior)
      if (realtimeData.temperature || realtimeData.tempf || realtimeData.tempc) {
        const temp = realtimeData.temperature || realtimeData.tempf || realtimeData.tempc;
        data += `- Temperatura: ${temp}°C\n`;
      }
      if (realtimeData.humidity) {
        data += `- Humedad: ${realtimeData.humidity}%\n`;
      }
      if (realtimeData.pressure || realtimeData.baromrelin || realtimeData.baromabsin) {
        const pressure = realtimeData.pressure || realtimeData.baromrelin || realtimeData.baromabsin;
        data += `- Presión: ${pressure} hPa\n`;
      }
      if (realtimeData.windSpeed || realtimeData.windspeedmph || realtimeData.windspeedkmh) {
        const windSpeed = realtimeData.windSpeed || realtimeData.windspeedmph || realtimeData.windspeedkmh;
        data += `- Velocidad del Viento: ${windSpeed} km/h\n`;
      }
      if (realtimeData.windDirection || realtimeData.winddir) {
        const windDir = realtimeData.windDirection || realtimeData.winddir;
        data += `- Dirección del Viento: ${windDir}°\n`;
      }
      if (realtimeData.rainfall || realtimeData.rainratein) {
        const rain = realtimeData.rainfall || realtimeData.rainratein;
        data += `- Lluvia: ${rain} mm/h\n`;
      }
      if (realtimeData.uv || realtimeData.uv1) {
        const uv = realtimeData.uv || realtimeData.uv1;
        data += `- Índice UV: ${uv}\n`;
      }
      if (realtimeData.solarRadiation || realtimeData.solarradiation) {
        const solar = realtimeData.solarRadiation || realtimeData.solarradiation;
        data += `- Radiación Solar: ${solar} W/m²\n`;
      }
      
      data += `\n`;
    }



    return data;
  };

  const formatBasicDeviceData = (device: DeviceInfo) => {
    return `Datos del Dispositivo: ${device.DeviceName}\n\n` +
           `Información General:\n` +
           `- Nombre: ${device.DeviceName}\n` +
           `- Tipo: ${device.DeviceType}\n` +
           `- Estado: ${device.status}\n\n` +
           `Nota: Los datos en tiempo real no están disponibles en este momento.\n\n` +
           `Puedes preguntarme sobre:\n` +
           `- Información general del dispositivo\n` +
           `- Configuración y características\n` +
           `- Estado y conectividad\n`;
  };

  const formatGroupDataForChat = (group: Group, deviceDataResults?: any[]) => {
    let data = `Datos del Grupo: ${group.GroupName}\n\n`;
    
    // Información básica del grupo
    data += `Información General:\n`;
    data += `- Nombre: ${group.GroupName}\n`;
    data += `- Descripción: ${group.Description || 'Sin descripción'}\n`;
    data += `- Estado: ${group.status}\n`;
    data += `- Creado: ${new Date(group.createdAt).toLocaleDateString()}\n\n`;

    // Información de dispositivos en el grupo
    if (deviceDataResults && deviceDataResults.length > 0) {
      data += `Dispositivos en el Grupo:\n`;
      deviceDataResults.forEach((deviceData, index) => {
        const deviceName = deviceData.deviceInfo?.deviceName || 
                          deviceData.deviceCharacteristics?.deviceName || 
                          `Dispositivo ${index + 1}`;
        data += `- ${deviceName}\n`;
      });
      data += `\n`;
    }

    // Datos en tiempo real del grupo
    if (deviceDataResults && deviceDataResults.length > 0) {
      data += `Datos en Tiempo Real del Grupo:\n`;
      
      deviceDataResults.forEach((deviceData) => {
        const deviceName = deviceData.deviceInfo?.deviceName || 
                          deviceData.deviceCharacteristics?.deviceName || 
                          `Dispositivo ${deviceData.deviceId}`;
        
        data += `\n${deviceName}:\n`;
        
        console.log('🔍 [ChatDeviceSelector] Formateando datos para dispositivo:', {
          deviceId: deviceData.deviceId,
          deviceName,
          hasRealtimeData: !!deviceData.realtimeData,
          hasIndoor: !!deviceData.realtimeData?.indoor,
          hasPressure: !!deviceData.realtimeData?.pressure,
          hasSoil: !!deviceData.realtimeData?.soil_ch1,
          hasBattery: !!deviceData.realtimeData?.battery,
          realtimeDataKeys: deviceData.realtimeData ? Object.keys(deviceData.realtimeData) : []
        });
        
        if (deviceData.realtimeData) {
          // Sensores interiores
          if (deviceData.realtimeData.indoor) {
            if (deviceData.realtimeData.indoor.temperature) {
              const temp = deviceData.realtimeData.indoor.temperature;
              const value = typeof temp === 'object' ? temp.value : temp;
              const time = typeof temp === 'object' ? temp.time : Date.now();
              data += `  - Temperatura Interior: ${value}°C (${new Date(time * 1000).toLocaleTimeString()})\n`;
            }
            if (deviceData.realtimeData.indoor.humidity) {
              const hum = deviceData.realtimeData.indoor.humidity;
              const value = typeof hum === 'object' ? hum.value : hum;
              const time = typeof hum === 'object' ? hum.time : Date.now();
              data += `  - Humedad Interior: ${value}% (${new Date(time * 1000).toLocaleTimeString()})\n`;
            }
          }

          // Sensores de presión
          if (deviceData.realtimeData.pressure) {
            if (deviceData.realtimeData.pressure.relative) {
              const rel = deviceData.realtimeData.pressure.relative;
              data += `  - Presión Relativa: ${rel.value} ${rel.unit} (${new Date(rel.time * 1000).toLocaleTimeString()})\n`;
            }
            if (deviceData.realtimeData.pressure.absolute) {
              const abs = deviceData.realtimeData.pressure.absolute;
              data += `  - Presión Absoluta: ${abs.value} ${abs.unit} (${new Date(abs.time * 1000).toLocaleTimeString()})\n`;
            }
          }

          // Sensores de suelo CH1
          if (deviceData.realtimeData.soil_ch1) {
            if (deviceData.realtimeData.soil_ch1.soilmoisture) {
              const soil = deviceData.realtimeData.soil_ch1.soilmoisture;
              data += `  - Humedad del Suelo CH1: ${soil.value} ${soil.unit} (${new Date(soil.time * 1000).toLocaleTimeString()})\n`;
            }
            if (deviceData.realtimeData.soil_ch1.ad) {
              const ad = deviceData.realtimeData.soil_ch1.ad;
              data += `  - Señal Analógica CH1: ${ad.value} ${ad.unit} (${new Date(ad.time * 1000).toLocaleTimeString()})\n`;
            }
          }

          // Sensores de batería
          if (deviceData.realtimeData.battery && deviceData.realtimeData.battery.soilmoisture_sensor_ch1) {
            const battery = deviceData.realtimeData.battery.soilmoisture_sensor_ch1;
            data += `  - Batería Sensor Suelo: ${battery.value} ${battery.unit} (${new Date(battery.time * 1000).toLocaleTimeString()})\n`;
          }

          // Datos legacy
          if (deviceData.realtimeData.temperature || deviceData.realtimeData.tempf || deviceData.realtimeData.tempc) {
            const temp = deviceData.realtimeData.temperature || deviceData.realtimeData.tempf || deviceData.realtimeData.tempc;
            data += `  - Temperatura: ${temp}°C\n`;
          }
          if (deviceData.realtimeData.humidity) {
            data += `  - Humedad: ${deviceData.realtimeData.humidity}%\n`;
          }
          if (deviceData.realtimeData.pressure || deviceData.realtimeData.baromrelin || deviceData.realtimeData.baromabsin) {
            const pressure = deviceData.realtimeData.pressure || deviceData.realtimeData.baromrelin || deviceData.realtimeData.baromabsin;
            data += `  - Presión: ${pressure} hPa\n`;
          }
        }
      });
      
      data += `\n`;
    }



    return data;
  };

  const formatBasicGroupData = (group: Group) => {
    return `Datos del Grupo: ${group.GroupName}\n\n` +
           `Información General:\n` +
           `- Nombre: ${group.GroupName}\n` +
           `- Descripción: ${group.Description || 'Sin descripción'}\n` +
           `- Estado: ${group.status}\n` +
           `- Creado: ${new Date(group.createdAt).toLocaleDateString()}\n\n` +
           `Nota: Los datos detallados del grupo no están disponibles en este momento.\n\n` +
           `Puedes preguntarme sobre:\n` +
           `- Información general del grupo\n` +
           `- Configuración y estructura\n` +
           `- Estado y gestión\n`;
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchBar = () => (
    <div className="relative text-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-white/50" />
      </div>
      <input
        type="text"
        placeholder="Buscar dispositivos o grupos..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => handleSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  const renderDeviceTypeFilter = () => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleDeviceTypeFilterChange('all')}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
          deviceTypeFilter === 'all'
            ? 'bg-emerald-500 text-white shadow-lg'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }`}
      >
        Todos
      </button>
      {deviceTypes.map((type) => (
        <button
          key={type}
          onClick={() => handleDeviceTypeFilterChange(type)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            deviceTypeFilter === type
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );

  const renderDeviceItem = (device: DeviceInfo) => (
    <button
      key={device.DeviceID}
      onClick={() => handleDeviceSelect(device)}
      disabled={isLoadingData}
      className="w-full p-4 rounded-xl border cursor-pointer transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all ${
            device.status === 'active' 
              ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30' 
              : 'bg-gray-500/20 group-hover:bg-gray-500/30'
          }`}>
            <DevicePhoneMobileIcon className={`w-4 h-4 ${
              device.status === 'active' ? 'text-emerald-400' : 'text-gray-400'
            }`} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
              {device.DeviceName}
            </h4>
            <p className="text-xs text-white/60">{device.DeviceType}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {device.status === 'active' && (
            <SignalIcon className="w-4 h-4 text-emerald-400" />
          )}
        </div>
      </div>
    </button>
  );

  const renderGroupItem = (group: Group) => (
    <button
      key={group.DeviceGroupID}
      onClick={() => handleGroupSelect(group)}
      disabled={isLoadingData}
      className="w-full p-4 rounded-xl border cursor-pointer transition-all duration-300 bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all ${
            group.status === 'active' 
              ? 'bg-blue-500/20 group-hover:bg-blue-500/30' 
              : 'bg-gray-500/20 group-hover:bg-gray-500/30'
          }`}>
            <UsersIcon className={`w-4 h-4 ${
              group.status === 'active' ? 'text-blue-400' : 'text-gray-400'
            }`} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
              {group.GroupName}
            </h4>
            <p className="text-xs text-white/60">{group.Description || 'Sin descripción'}</p>
          </div>
          <div className="flex items-center gap-2">
            <WifiIcon className="w-4 h-4 text-blue-400" />
          </div>
        </div>
      </div>
    </button>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="w-[320px] min-h-[88vh] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl">
            <SparklesIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Seleccionar
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex-1 py-3 px-4 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'devices'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DevicePhoneMobileIcon className="w-4 h-4" />
              Dispositivos
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 px-4 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'groups'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Grupos
            </div>
          </button>
        </div>

        {/* Search Bar */}
        {renderSearchBar()}

        {/* Device Type Filter */}
        {activeTab === 'devices' && devices.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-white/60" />
                <span className="text-sm font-medium text-white">Filtrar por tipo:</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Limpiar
              </button>
            </div>
            {renderDeviceTypeFilter()}
          </div>
        )}

        {/* Content */}
        {loading ? (
          // Estado de carga
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            <p className="text-white/60 text-sm">Cargando dispositivos...</p>
          </div>
        ) : isLoadingData ? (
          // Estado de carga de datos específicos
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            <p className="text-white/60 text-sm">Obteniendo datos del dispositivo...</p>
          </div>
        ) : (
          // Contenido normal
          <div className="flex flex-col gap-2">
            {activeTab === 'devices' ? (
              filteredDevices.length > 0 ? (
                filteredDevices.map(renderDeviceItem)
              ) : (
                <div className="text-center py-12">
                  <DevicePhoneMobileIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-sm mb-2">No se encontraron dispositivos</p>
                  <p className="text-white/40 text-xs">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay dispositivos disponibles'}
                  </p>
                </div>
              )
            ) : (
              filteredGroups.length > 0 ? (
                filteredGroups.map(renderGroupItem)
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-sm mb-2">No se encontraron grupos</p>
                  <p className="text-white/40 text-xs">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay grupos disponibles'}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty State - Solo mostrar cuando no está cargando y no hay datos */}
        {!loading && !isLoadingData && !error && devices.length === 0 && groups.length === 0 && (
          <div className="text-center py-12">
            <DevicePhoneMobileIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-sm mb-2">No hay dispositivos disponibles</p>
            <p className="text-white/40 text-xs">
              Registra un dispositivo en la sección de telemetría para comenzar
            </p>
          </div>
        )}

        {/* Error State - Solo mostrar errores críticos */}
        {error && 
         !error.includes('User not authenticated') && 
         !error.includes('No authentication token found') && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XMarkIcon className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 text-sm font-medium">Error</p>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDeviceSelector; 