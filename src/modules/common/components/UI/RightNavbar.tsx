import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ImgProfileNavbar from "./ImgProfileNavbar";
import DropNavbar from "./SigninNavbar";

export default function RightNavbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <div className="flex-1 flex justify-end relative text-sm">
            {isAuthenticated ? (
                <ImgProfileNavbar onLogout={handleLogout} />
            ) : (
                <DropNavbar />
            )}
        </div>
    );
}
