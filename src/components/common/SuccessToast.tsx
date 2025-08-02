import { toast } from 'react-hot-toast';

/**
 * Muestra un toast de éxito con el mensaje proporcionado.
 * Uso: showSuccessToast('¡Grupo creado satisfactoriamente!');
 */
export function showSuccessToast(message: string) {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981', // emerald-500
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(16,185,129,0.15)'
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
} 