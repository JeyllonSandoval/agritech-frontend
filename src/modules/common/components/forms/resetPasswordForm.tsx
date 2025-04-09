"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States for initial token validation
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [validationMessage, setValidationMessage] = useState("Validating link...");

    useEffect(() => {
        const validateToken = async () => {
            setIsValidatingToken(true);
            if (!token) {
                setValidationMessage("Invalid or missing password reset link.");
                setIsTokenValid(false);
                setIsValidatingToken(false);
                return;
            }

            try {
                // --- Backend Validation Call (Assumed Endpoint) ---
                // Replace with your actual endpoint if you create one
                const validationResponse = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/validate-reset-token/${token}`, {
                    method: "GET",
                });
                // --- End Backend Validation Call ---

                if (validationResponse.ok) {
                    setIsTokenValid(true);
                    setValidationMessage(""); // Clear validation message
                } else {
                    // Handle invalid/expired token response from backend
                    const errorData = await validationResponse.json();
                    setValidationMessage(errorData.message || errorData.error || "This password reset link is invalid or has expired.");
                    setIsTokenValid(false);
                }
            } catch (error) {
                // Handle network or other errors during validation fetch
                console.error("Error validating token:", error);
                setValidationMessage("Could not validate the reset link. Please check your connection.");
                setIsTokenValid(false);
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateToken();
    }, [token]); // Re-validate if the token changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous submission messages

        // --- Frontend Password Validation ---
        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        // --- End Frontend Password Validation ---

        // Ensure token is still considered valid before submitting
        if (!token || !isTokenValid) {
            setMessage("Cannot reset password with an invalid link.");
            return;
        }

        setIsSubmitting(true);

        try {
            // --- Submit to Backend --- 
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: newPassword }),
            });
            // --- End Submit to Backend ---

            const data = await response.json();

            if (!response.ok) {
                // Throw error using backend message or a fallback
                throw new Error(data.message || data.error || "Failed to reset password. Please try again.");
            }

            // --- Handle Success --- 
            setMessage("Your password has been successfully reset. Redirecting...");
            setTimeout(() => {
                router.push("/signin"); // Redirect to sign-in page
            }, 3000);

        } catch (error) {
            // --- Handle Submission Errors --- 
            console.error("Error in password reset submission:", error);
            setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Conditional Rendering --- 

    // 1. Loading state during initial token validation
    if (isValidatingToken) {
        return (
            <section className="w-full h-screen flex justify-center items-center px-4">
                <div className="w-full max-w-md p-8 text-center 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg shadow-emerald-400/20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p className="text-white/80">{validationMessage}</p>
                </div>
            </section>
        );
    }

    // 2. Invalid/Expired token state
    if (!isTokenValid) {
        return (
            <section className="w-full h-screen flex justify-center items-center px-4">
                <div className="w-full max-w-md p-8 text-center 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-red-400/50 shadow-lg shadow-red-400/20">
                    <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-xl font-semibold text-red-400 mb-3">Link Invalid or Expired</h1>
                    <p className="text-white/80 mb-6">{validationMessage}</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="px-5 py-2.5 text-sm 
                            bg-emerald-400/90 text-black font-medium rounded-xl 
                            hover:bg-emerald-400 active:bg-emerald-500 
                            focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300"
                    >
                        Request New Link
                    </button>
                </div>
            </section>
        );
    }

    // 3. Valid token state - Show the form
    return (
        <section className="w-full h-screen flex justify-center items-center px-4">
            <form onSubmit={handleSubmit} noValidate
                className="w-full max-w-md p-8 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg shadow-emerald-400/20"
            >
                <div className="flex flex-col items-center gap-8">
                    {/* Form Header */} 
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
                        <p className="text-sm text-white/70">Enter your new password</p>
                    </div>

                    <div className="w-full space-y-4">
                        {/* New Password Field */} 
                        <div> 
                            <div className="relative flex items-center">
                                <input
                                    className={`w-full px-4 py-3 text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border ${(message === "Passwords do not match" || message === "Password must be at least 8 characters long") ? 'border-red-400/60' : 'border-white/20'} text-white
                                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40 transition-all duration-300 pr-12`}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New password *"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    aria-describedby="passwordError"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 p-1.5 rounded-lg text-white/40 hover:text-emerald-400/70 focus:outline-none disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {/* Icons */} 
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    )}
                                </button>
                            </div>
                            {/* Inline error for password length */} 
                            {message === "Password must be at least 8 characters long" && 
                             <p id="passwordError" className="text-red-400 text-xs mt-1 ml-1">{message}</p>}
                        </div>

                        {/* Confirm Password Field */} 
                        <div>
                            <div className="relative flex items-center">
                                <input
                                    className={`w-full px-4 py-3 text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border ${message === "Passwords do not match" ? 'border-red-400/60' : 'border-white/20'} text-white
                                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40 transition-all duration-300 pr-12`}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password *"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    aria-describedby="confirmPasswordError"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {/* Inline error for password mismatch */} 
                            {message === "Passwords do not match" && 
                             <p id="confirmPasswordError" className="text-red-400 text-xs mt-1 ml-1">{message}</p>}
                        </div>

                        {/* Submit Button */} 
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 text-sm
                                bg-emerald-400/90 text-black font-medium rounded-xl
                                hover:bg-emerald-400 active:bg-emerald-500
                                focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300
                                flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </>
                            )}
                        </button>

                        {/* General Submission Message Area (Success or Backend Errors) */} 
                        {/* Only show general message if it's NOT a password validation message handled inline */}
                        {message && !(message === "Passwords do not match" || message === "Password must be at least 8 characters long") && (
                            <div className={`text-sm px-4 py-3 rounded-xl 
                                flex items-center gap-2 ${
                                    message.includes("successfully reset") 
                                        ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400" 
                                        : "bg-red-400/10 border border-red-400/20 text-red-400"
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {/* Icon based on success/error */}
                                    {message.includes("successfully reset") ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </section>
    );
} 