import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DropNavbar() {
    const pathname = usePathname();
    const isSignInRoute = pathname === '/signin';

    return (
        <div className="text-lg lg:text-2xl rounded-full relative">
            <Link href="/signin"
                className={`px-4 py-2 rounded-xl
                    bg-gradient-to-r from-emerald-700/30 to-emerald-600/30
                    hover:from-emerald-600/40 hover:to-emerald-500/40
                    active:from-emerald-800/30 active:to-emerald-700/30
                    backdrop-blur-sm
                    text-emerald-100
                    transition-all duration-300
                    relative
                    border border-emerald-300/50
                    overflow-hidden`}
            >
                <span className="relative z-10">Sign Up</span>
                {!isSignInRoute && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-700/20 to-transparent animate-border-flow"></div>
                    </div>
                )}
            </Link>
        </div>
    );
}
