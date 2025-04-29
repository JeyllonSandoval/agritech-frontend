"use client";
import { useState } from "react";
import LoginForm from "@/components/features/forms/loginForm";
import RegisterForm from "@/components/features/forms/registerForm";

export default function Signin() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <section className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Contenedor del toggle izquierdo (Register) */}
            <div className={`fixed transition-all duration-500 ease-in-out
                ${!isLogin ? 'left-80 opacity-100' : '-left-full opacity-0'}`}
            >
                <div className="flex flex-col items-end gap-4">
                    <div className="flex flex-col text-right">
                        <h2 className="text-white/70 text-sm">
                            Already have an account?
                        </h2>
                        <p className="text-emerald-400 text-sm font-medium">
                            Sign in here
                        </p>
                    </div>
                    <button
                        onClick={() => setIsLogin(true)}
                        className="transition-all duration-300
                            bg-white/10 backdrop-blur-sm
                            px-4 py-2 rounded-lg
                            border border-white/20
                            text-white/70 hover:text-white
                            hover:bg-emerald-400/20
                            hover:border-emerald-400/30
                            hover:-translate-x-2
                            shadow-lg shadow-black/5"
                    >
                        <p>&lt;</p>
                    </button>
                </div>
            </div>

            {/* Contenedor de los formularios con transición */}
            <div className="w-full max-w-md">
                <div className={`transition-all duration-500 ease-in-out transform
                    ${isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
                >
                    {isLogin && <LoginForm />}
                </div>
                <div className={`transition-all duration-500 ease-in-out transform
                    ${!isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                >
                    {!isLogin && <RegisterForm />}
                </div>
            </div>

            {/* Contenedor del toggle derecho (Login) */}
            <div className={`fixed transition-all duration-500 ease-in-out
                ${isLogin ? 'right-80 opacity-100' : '-right-full opacity-0'}`}
            >
                <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-white/70 text-sm">
                            Need an account?
                        </h2>
                        <p className="text-emerald-400 text-sm font-medium">
                            Register here
                        </p>
                    </div>
                    <button
                        onClick={() => setIsLogin(false)}
                        className="transition-all duration-300
                            bg-white/10 backdrop-blur-sm
                            px-4 py-2 rounded-lg
                            border border-white/20
                            text-white/70 hover:text-white
                            hover:bg-emerald-400/20
                            hover:border-emerald-400/30
                            hover:translate-x-2
                            shadow-lg shadow-black/5"
                    >
                        <p>&gt;</p>
                    </button>
                </div>
            </div>
        </section>
    );
}