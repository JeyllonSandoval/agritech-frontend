import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DropNavbar() {
    const pathname = usePathname();
    const isSignInRoute = pathname === '/signin';

    return (
        <div className="text-xl rounded-full">
            <Link href="/signin" 
                className={`px-8 py-3 bg-emerald-400/90
                    hover:scale-105 text-black rounded-full shadow-xl shadow-emerald-300/90 
                    transition-all duration-300 inline-block
                    [backdrop-filter:blur(0px)] hover:[backdrop-filter:blur(4px)]
                    ${!isSignInRoute ? 'animate-pulse' : ''}`}
            >
                Sign Up
            </Link>
        </div>
    );
}
