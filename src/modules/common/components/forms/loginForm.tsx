"use client";

import { useState } from "react";

const Login = () => {
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
                setMessage(`¡Bienvenido ${data.user.FirstName}!, ${data.token}`);

            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setMessage("Error al conectar con el servidor");
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
                            className="w-1/2 h-1/2 rounded-lg text-center text-white custom-bg2 text-2xl p-3"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                    {message && <p className="text-red-500 text-xl text-center m-0 p-0 w-1/3">{message}</p>}
                </div>
            </form>
        </section>
    );
};


export default Login;



