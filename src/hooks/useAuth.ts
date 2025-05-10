import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Aquí iría tu lógica de verificación de autenticación
                // Por ejemplo, verificar un token en localStorage o hacer una llamada a la API
                const token = localStorage.getItem('token');
                setIsAuthenticated(!!token);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return {
        isAuthenticated,
        isLoading
    };
} 