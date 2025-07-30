import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            // Solo acceder a localStorage en el cliente
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                setIsAuthenticated(!!token);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Asegurar que estamos en el cliente
        setIsClient(true);
        checkAuth();

        // Solo agregar event listeners si estamos en el cliente
        if (typeof window !== 'undefined') {
            // Listen for login state changes
            const handleLoginStateChange = () => {
                checkAuth();
            };

            window.addEventListener('loginStateChange', handleLoginStateChange);

            return () => {
                window.removeEventListener('loginStateChange', handleLoginStateChange);
            };
        }
    }, []);

    return {
        isAuthenticated,
        isLoading: isLoading || !isClient
    };
} 