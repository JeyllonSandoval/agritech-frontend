"use client";

import { useState } from "react";

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="w-full h-full flex py-10">
            <div className="w-full h-full flex bg-gray-100 relative overflow-hidden py-10">
                {/* Sidebar */}
                <div
                    className={`fixed left-0 top-24 h-full py-15 bg-gray-800 text-white p-4 flex flex-col gap-4 text-2xl transition-transform duration-300 ${
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

                {/* Button to show sidebar */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-gray-700 text-white m-2 rounded-md text-lg fixed top-4 left-4 z-[20]"
                    >
                        Show Menu
                    </button>
                )}

                {/* Main Content */}
                <div
                    className={`flex-grow bg-white transition-all duration-300 ${
                        isSidebarOpen ? "ml-[300px]" : "ml-0"
                    }`}
                >
                    <div className="flex items-center justify-center h-full bg-gray-500">
                        <h2 className="text-4xl">Welcome</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

