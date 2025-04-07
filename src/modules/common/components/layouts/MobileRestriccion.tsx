"use client";

import { useEffect, useState } from "react";

export default function MobileRestriccion() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        // Check on mount
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8 max-w-md w-full mx-4">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-semibold text-white">
                            Mobile Device Detected
                        </h2>
                        <p className="text-white/70 text-lg">
                            Sorry, this application is not available for mobile devices.
                            Please access from a computer or tablet with a larger screen.
                        </p>
                    </div>

                    <div className="w-full h-px bg-white/10"></div>

                    <div className="text-center">
                        <p className="text-sm text-white/50">
                            Minimum required size: 1024px
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
