import { useRouter } from "next/navigation";

export default function ButtonLogout() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('loginStateChange'));
        
        if (window.location.pathname === '/') {
            window.location.reload();
        } else {
            router.push("/");
        }
    };

    return (
        <section onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-300 ease-in-out text-lg">
            Logout
        </section>
    )
}
