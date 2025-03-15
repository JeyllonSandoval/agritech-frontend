"use client";

import NavbarLateral from "./navbarLateral";

export default function PlaygroundLayout() {

    return (
        <div className="w-full h-full flex">
            <div className="w-full h-full flex bg-gray-100 relative overflow-hidden">
                <NavbarLateral />

                {/* Main Content */}
                <div
                    className={`flex-grow bg-white transition-all duration-300`}
                >
                    <div className="flex items-center justify-center h-full bg-gray-500">
                        <h2 className="text-4xl">Welcome</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

