import { usePathname } from "next/navigation";
import ImgProfileNavbar from "./ImgProfileNavbar";
import DropNavbar from "./SigninNavbar";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RightNavbar() {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('loginStateChange'));
        router.push('/');
    };

    if (isLoading) {
        return <div className="w-[200px] lg:w-[250px] flex justify-end" />;
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
