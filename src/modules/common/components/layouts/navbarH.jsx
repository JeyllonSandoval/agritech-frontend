"use client";
import LeftNavbar from '@/modules/common/components/UI/LeftNavbar';
import CenterNavbar from '@/modules/common/components/UI/CenterNavbar';
import RightNavbar from '@/modules/common/components/UI/RightNavbar';

export default function NavbarH() {

    return (
        <section className="w-[98%] fixed top-0 z-[10]">
            <nav className="w-full flex justify-between items-center text-white/90 px-8 py-5 rounded-2xl ">
                {/* Left section - Company name */}
                <LeftNavbar />

                {/* Middle section - Navigation links */}
                <CenterNavbar />

                {/* Right section - User profile or Sign Up button */}
                <RightNavbar />
            </nav>
        </section>
    );
}
