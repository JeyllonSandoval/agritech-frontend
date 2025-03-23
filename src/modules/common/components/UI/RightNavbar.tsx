import { usePathname } from "next/navigation";
import ImgProfileNavbar from "./ImgProfileNavbar";
import DropNavbar from "./SigninNavbar";
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from "next/navigation";

export default function RightNavbar() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('loginStateChange'));
        router.push('/');
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
