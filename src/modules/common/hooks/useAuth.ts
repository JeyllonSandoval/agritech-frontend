import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        // Verificar autenticación inicial
        checkAuth();

        // Escuchar cambios en el estado de login
        const handleLoginStateChange = () => {
            checkAuth();
        };

        window.addEventListener('loginStateChange', handleLoginStateChange);

        return () => {
            window.removeEventListener('loginStateChange', handleLoginStateChange);
        };
    }, []);

    const redirectToLogin = (pathname: string) => {
        router.push(`/signin?redirect=${pathname}`);
    };

    return {
        isAuthenticated,
        redirectToLogin
    };
}; 