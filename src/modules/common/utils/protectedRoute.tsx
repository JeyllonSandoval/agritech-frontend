"use client";
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAuthenticated, redirectToLogin } = useAuth();

    // Si isAuthenticated es null, significa que aún está verificando
    if (isAuthenticated === null) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-emerald-400/90 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white/70">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
        redirectToLogin(pathname);
        return null;
    }

    // Si está autenticado, muestra el contenido
    return <>{children}</>;
}