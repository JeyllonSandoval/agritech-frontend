# Configuración de la API

## Variables de Entorno

Para configurar correctamente la URL del backend, puedes usar las siguientes variables de entorno:

### Desarrollo Local
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

### Producción (Vercel)
```bash
# Variables de entorno en Vercel
NEXT_PUBLIC_API_URL=https://agritech-backend.vercel.app
```

## Prioridad de Configuración

La aplicación usa la siguiente prioridad para determinar la URL del backend:

1. **NEXT_PUBLIC_API_URL** - Variable principal
2. **NEXT_PUBLIC_BACKEND_URL** - Variable alternativa
3. **URL de producción por defecto** - `https://agritech-backend.vercel.app`
4. **URL de desarrollo por defecto** - `http://127.0.0.1:5000`

## Configuración en Vercel

Para configurar las variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Ve a Settings > Environment Variables
3. Agrega la variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://agritech-backend.vercel.app`
   - **Environment**: Production, Preview, Development

## Solución para Brave

Si tienes problemas con Brave bloqueando las peticiones:

1. **Deshabilitar Shields temporalmente:**
   - Haz clic en el ícono de Shields (🛡️) en la barra de direcciones
   - Cambia de "Agresivo" a "Deshabilitado"
   - Recarga la página

2. **Agregar excepción permanente:**
   - Ve a Configuración de Brave → Shields
   - Agrega tu dominio de Vercel a las excepciones

## Debug

En desarrollo, puedes ver la configuración actual en la esquina inferior izquierda de la pantalla. 