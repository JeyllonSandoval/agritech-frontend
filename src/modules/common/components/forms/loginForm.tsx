"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                // Disparar evento personalizado
                window.dispatchEvent(new Event('loginStateChange'));
                
                router.push("/");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            setMessage("Error connecting to the server");
        }
    };

    return (
        <section className="w-full h-full flex justify-center items-center">
            <form onSubmit={handleLogin} className="w-1/2 h-full flex flex-col justify-center items-center">
                <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                    <h1 className="text-4xl m-0 p-0">Login</h1>
                    <p className="text-lg m-0 p-0">Welcome back to AgriTech</p>
                    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                        <input
                            className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3"
                            type="text"
                            placeholder="Email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="w-1/2 h-1/2 rounded-lg text-center text-white custom-bg2 text-2xl p-3 hover:scale-105 transition-all duration-300 ease-in-out"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};


export default Login;



