import Link from "next/link";
import Signin from "@/modules/common/components/UI/ButtonSign";
export default function NavbarH() {
    return (
<section className="w-full fixed top-0 z-[10000] bg-transparent backdrop-blur-xl">
            <nav className="w-full flex justify-around items-center text-white gap-[250px] py-5">
                <h1 className="text-4xl m-0 p-0">AgriTech</h1>
                <ul className="flex list-none m-0 p-0 gap-8">
                    <li className="flex items-center">
                        <Link href="/" className="text-white text-lg relative px-2.5 py-1 transition-all duration-300 ease-in-out hover:font-bold hover:scale-110 hover:bg-white/10 rounded-2xl">
                            Home
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link href="/playground" className="text-white text-lg relative px-2.5 py-1 transition-all duration-300 ease-in-out hover:font-bold hover:scale-110 hover:bg-white/10 rounded-2xl">
                            Playground
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link href="/about" className="text-white text-lg relative px-2.5 py-1 transition-all duration-300 ease-in-out hover:font-bold hover:scale-110 hover:bg-white/10 rounded-2xl">
                            About
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link href="/signin"><Signin /></Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}
