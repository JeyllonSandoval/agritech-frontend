# Sistema de Telemetría

Este directorio contiene todos los componentes necesarios para el sistema de telemetría en tiempo real de AgriTech.

## 📁 Estructura

```
telemetry/
├── index.ts                    # Exportaciones de componentes
├── README.md                   # Esta documentación
├── RealtimeDataDisplay.tsx     # Visualización de datos en tiempo real
├── TelemetryStats.tsx          # Estadísticas del sistema
├── TelemetryControls.tsx       # Controles de monitoreo
└── TelemetryAlerts.tsx         # Gestión de alertas
```

## 🎯 Componentes

### RealtimeDataDisplay
Muestra los datos de telemetría en tiempo real de todos los dispositivos conectados.

**Props:**
- `devices: Device[]` - Lista de dispositivos
- `loadingState: LoadingState` - Estado de carga
- `lastUpdate?: Date` - Última actualización
- `onDeviceClick?: (device: Device) => void` - Callback al hacer clic en dispositivo

### TelemetryStats
Muestra estadísticas detalladas del sistema de telemetría.

**Props:**
- `stats: TelemetryStats` - Estadísticas del sistema
- `className?: string` - Clases CSS adicionales

### TelemetryControls
Controles para iniciar/detener el monitoreo y refrescar datos.

**Props:**
- `isRunning: boolean` - Estado del monitoreo
- `onStart: () => void` - Función para iniciar
- `onStop: () => void` - Función para detener
- `onRefresh: () => void` - Función para refrescar
- `onSettings?: () => void` - Función para configuración
- `lastUpdate?: Date` - Última actualización
- `updateInterval?: number` - Intervalo de actualización
- `className?: string` - Clases CSS adicionales

### TelemetryAlerts
Gestiona y muestra las alertas del sistema.

**Props:**
- `alerts: TelemetryAlert[]` - Lista de alertas
- `onAcknowledge: (alertId: string) => void` - Función para reconocer alerta
- `onDismiss: (alertId: string) => void` - Función para descartar alerta
- `className?: string` - Clases CSS adicionales

## 🔧 Uso

```tsx
import { 
  RealtimeDataDisplay, 
  TelemetryStats, 
  TelemetryControls, 
  TelemetryAlerts 
} from '@/components/features/telemetry';

// En tu componente
const MyTelemetryPage = () => {
  const {
    data,
    loadingState,
    isRunning,
    stats,
    alerts,
    startMonitoring,
    stopMonitoring,
    refreshData,
    acknowledgeAlert
  } = useTelemetry({
    devices: ['MAC1', 'MAC2'],
    updateInterval: 30000
  });

  return (
    <div>
      <TelemetryControls
        isRunning={isRunning}
        onStart={startMonitoring}
        onStop={stopMonitoring}
        onRefresh={refreshData}
      />
      
      <TelemetryStats stats={stats} />
      
      <TelemetryAlerts
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        onDismiss={(id) => console.log('Dismiss:', id)}
      />
      
      {data && (
        <RealtimeDataDisplay
          devices={data.devices}
          loadingState={loadingState}
          lastUpdate={data.timestamp}
        />
      )}
    </div>
  );
};
```

## 🎨 Características de Diseño

- **Tema Oscuro**: Todos los componentes están optimizados para el tema oscuro de AgriTech
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves y efectos visuales
- **Accesibilidad**: Controles accesibles con teclado y lectores de pantalla
- **Estados de Carga**: Indicadores visuales para diferentes estados

## 🔗 Integración con API

Los componentes están diseñados para trabajar con la API de Ecowitt y utilizan:

- **Tipos TypeScript**: Definidos en `@/types/telemetry`
- **Hook personalizado**: `useTelemetry` para manejo de estado
- **Servicio**: `TelemetryService` para comunicación con la API

## 🚀 Próximas Características

- [ ] Gráficos en tiempo real
- [ ] Configuración de umbrales de alerta
- [ ] Exportación de datos
- [ ] Notificaciones push
- [ ] Mapa de dispositivos
- [ ] Histórico de datos
- [ ] Reportes automáticos

## 📝 Notas de Desarrollo

- Todos los componentes son funcionales y utilizan hooks de React
- Utilizan Tailwind CSS para estilos
- Iconos de Heroicons
- Compatibles con TypeScript
- Siguen las convenciones de nomenclatura del proyecto 