import Link from "next/link";
import Signin from "@/modules/common/components/UI/ButtonSign";
export default function NavbarH() {
    return (
        <section>
            <nav>
                <h1>AgriTech</h1>
                <ul>
                    <li>
                        <Link href="/" >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/playground">
                            Playground
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/signin"><Signin /></Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}
