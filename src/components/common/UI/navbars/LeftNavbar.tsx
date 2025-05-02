import Link from "next/link";
import Image from "next/image";
export default function LeftNavbar() {
    return (
        <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 md:gap-4">
                <Image 
                    src="/icon/AgriTech-Logo-_transparent_.webp" 
                    alt="AgriTech Logo" 
                    width={60} 
                    height={60}
                    className="w-8 h-8 md:w-12 md:h-12"
                />
                <h1 className="text-lg md:text-2xl font-medium text-white">AgriTech</h1>
            </Link>
        </div>
    )
}
