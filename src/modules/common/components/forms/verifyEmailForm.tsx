"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setMessage("Invalid verification link");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/verify-email/${token}`, {
                    method: "GET",
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message || "Email verified successfully! Redirecting to home...");
                    // Store the new token in localStorage
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                        // Update user data in localStorage if provided
                        if (data.tokenData) {
                            localStorage.setItem("user", JSON.stringify(data.tokenData));
                        }
                    }
                    // Dispatch event to update profile state
                    window.dispatchEvent(new CustomEvent('profile-updated', { 
                        detail: { emailVerified: true } 
                    }));
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                } else {
                    setMessage(data.error || "Error verifying email");
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage("Error connecting to the server");
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <section className="w-full h-full flex justify-center items-center px-4">
            <div className="w-full max-w-md p-8 
                bg-white/10 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg shadow-emerald-400/20 mt-20"
            >
                <div className="flex flex-col items-center gap-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold text-white">
                            Email Verification
                        </h1>
                        <p className="text-sm text-white/70">
                            {isLoading ? "Verifying your email..." : message}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center">
                            <svg className="animate-spin h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    {!isLoading && (
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm text-white/50 
                                hover:text-emerald-400/70
                                focus:text-emerald-400
                                transition-colors duration-300
                                bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2"
                        >
                            Back to Home
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
} 