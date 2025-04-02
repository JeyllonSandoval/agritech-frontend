import Link from "next/link";
import Image from "next/image";
export default function LeftNavbar() {
    return (
        <div className="flex-1 flex flex-row">
            <Link href="/" className="flex flex-row items-center gap-4">
                <Image src="/AgriTech-Logo-_transparent_.webp" alt="AgriTech Logo" width={80} height={80} />
                <h1 className="text-4xl cursor-pointer">AgriTech</h1>
            </Link>
        </div>
    )
}
