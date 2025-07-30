import { usePathname } from "next/navigation";
import ImgProfileNavbar from "./ImgProfileNavbar";
import DropNavbar from "./SigninNavbar";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RightNavbar() {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Asegurar que el componente está montado en el cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = () => {
        if (typeof window === 'undefined') return;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('loginStateChange'));
        router.push('/');
    };

    // No renderizar hasta que esté montado en el cliente
    if (!isClient || isLoading) {
        return (
            <div className="w-[200px] lg:w-[250px] flex justify-end">
                <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center">
            {isAuthenticated ? (
                <ImgProfileNavbar onLogout={handleLogout} />
            ) : (
                <DropNavbar />
            )}
        </div>
    );
}
