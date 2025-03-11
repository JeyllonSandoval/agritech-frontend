import Link from "next/link";
import Signin from "@/modules/common/components/UI/ButtonSign";
export default function NavbarH() {
    return (
        <section className="w-full fixed top-0 z-[10000] bg-transparent backdrop-blur-xl">
            <nav className="w-full flex justify-around items-center text-white gap-[250px] py-5">
                <h1 className="text-4xl m-0 p-0 w-[150px]">AgriTech</h1>
                <ul className="flex list-none m-0 p-0 gap-8">
                    <li className="flex items-center w-[100px] justify-center">
                        <Link href="/" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                            Home
                        </Link>
                    </li>
                    <li className="flex items-center w-[100px] justify-center">
                        <Link href="/playground" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                            Playground
                        </Link>
                    </li>
                    <li className="flex items-center w-[100px] justify-center">
                        <Link href="/about" className="text-white text-lg relative px-2.5 py-1 transition-colors duration-300 ease-in-out hover:bg-white/10 rounded-2xl">
                            About
                        </Link>
                    </li>
                    <li className="flex items-center w-[120px] justify-center">
                        <Link href="/signin" className="text-white text-lg relative px-4 py-2 border-2 border-white rounded-full hover:scale-105 transition-all duration-300 ease-in-out hover:bg-white hover:text-black">
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}
