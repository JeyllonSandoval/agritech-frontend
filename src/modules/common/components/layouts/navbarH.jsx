"use client";
import LeftNavbar from '@/modules/common/components/UI/navbars/LeftNavbar';
import CenterNavbar from '@/modules/common/components/UI/navbars/CenterNavbar';
import RightNavbar from '@/modules/common/components/UI/navbars/RightNavbar';

export default function NavbarH() {

    return (
        <section className="w-[98%] fixed top-0 z-[10] flex justify-center items-center">
            <nav className="w-[90%] flex justify-between items-center  text-white/90 rounded-2xl ">
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
