import { useState } from "react";

interface NavbarLateralProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function NavbarLateral({ isSidebarOpen, setIsSidebarOpen }: NavbarLateralProps) {
    return (
        <section>
            <div
                className={`fixed left-0 top-24 h-full py-15 bg-gray-800 text-white p-4 flex flex-col gap-4 text-2xl transition-all duration-300 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ width: "300px" }}
            >
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="mb-4 text-lg text-right"
                >
                    Hide Menu
                </button>
                <button className="w-full mb-2 bg-blue-500 text-white rounded-md p-2">
                    File PDF
                </button>
                <button className="w-full mb-2 bg-green-500 text-white rounded-md p-2">
                    Create Chat
                </button>
                <div className="flex flex-col gap-2 mt-4 justify-center items-center">
                    <h2 className="text-lg">View Chats</h2>
                </div>
            </div>
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-gray-700 text-white m-2 rounded-md text-lg fixed top-4 left-4 z-[20]"
                >
                    Show Menu
                </button>
            )}
        </section>
    );
}
