import Link from "next/link";

export default function LeftNavbar() {
    return (
        <div className="flex-1">
        <Link href="/">
            <h1 className="text-4xl cursor-pointer">AgriTech</h1>
        </Link>
    </div>
    )
}
