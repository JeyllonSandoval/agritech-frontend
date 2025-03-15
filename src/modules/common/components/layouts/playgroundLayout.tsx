"use client";
import { useState } from "react";
import NavbarLateral from "./navbarLateral";
import PlaygroundPanel from "./PlaygroundPanel";

export default function PlaygroundLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="w-full h-full flex">
            <div className="w-full h-full flex bg-gray-100 relative overflow-hidden">
                <NavbarLateral 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />
                <PlaygroundPanel isSidebarOpen={isSidebarOpen} />
            </div>
        </div>
    );
}

