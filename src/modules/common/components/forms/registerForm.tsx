"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../hooks/useAuth';

interface Country {
    CountryID: string;
    countryname: string;
}

interface UserData {
    FirstName: string;
    LastName: string;
    Email: string;
    password: string;
    CountryID: string;
    image?: string;
}

export default function RegisterForm() {
    const router = useRouter();
    const { redirectToLogin } = useAuth();
    const [countries, setCountries] = useState<Country[]>([]);
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [CountryID, setCountryID] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCountry = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/countries`);
            const data = await response.json();
            if (data && Array.isArray(data)) {
                setCountries(data);
            } else {
                console.error("Invalid data format received:", data);
                setCountries([]);
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
            setCountries([]);
        }
    }

    useEffect(() => {
        fetchCountry();
    }, []);

    useEffect(() => {
        if (password && confirmPassword && password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            setMessage("");
        }
    }, [password, confirmPassword]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("FirstName", FirstName);
            formData.append("LastName", LastName);
            formData.append("Email", Email);
            formData.append("password", password);
            formData.append("CountryID", CountryID);
            
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/register`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                // Disparar evento personalizado
                window.dispatchEvent(new Event('loginStateChange'));
                
                router.push("/");
            } else {
                setMessage(data.message || data.error || "Error en el registro");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setMessage("Error de conexión con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <section className="w-full h-full flex justify-center items-center px-4">
            <form onSubmit={handleRegister} 
                className={`w-full max-w-2xl p-8 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg
                    transition-opacity duration-300
                    ${isSubmitting ? 'opacity-75' : 'opacity-100'}`}
            >
                <div className="flex flex-col items-center gap-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-semibold text-white">
                            Create Account
                        </h1>
                        <p className="text-sm text-white/70">
                            Join AgriTech and start your journey
                        </p>
                    </div>

                    <div className="w-full space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative flex items-center">
                                <input
                                    value={FirstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    type="text"
                                    placeholder="First Name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    value={LastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    type="text"
                                    placeholder="Last Name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="relative flex items-center md:col-span-2">
                                <input
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    type="email"
                                    placeholder="Email address"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="relative group">
                                <div className="relative flex items-center">
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300
                                            pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 
                                            p-1.5 rounded-lg
                                            text-white/40
                                            hover:text-emerald-400/70
                                            hover:bg-emerald-400/10
                                            active:bg-emerald-400/20
                                            transition-all duration-300
                                            focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="relative flex items-center">
                                    <input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300
                                            pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 
                                            p-1.5 rounded-lg
                                            text-white/40
                                            hover:text-emerald-400/70
                                            hover:bg-emerald-400/10
                                            active:bg-emerald-400/20
                                            transition-all duration-300
                                            focus:outline-none"
                                        disabled={isSubmitting}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="relative flex items-center group md:col-span-2">
                                <select
                                    value={CountryID}
                                    onChange={(e) => setCountryID(e.target.value)}
                                    className="w-full px-4 py-3 text-sm cursor-pointer
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    disabled={isSubmitting}
                                >
                                    <option value="" className="bg-gray-900 text-white">Select your country</option>
                                    {countries.map((country) => (
                                        <option 
                                            key={country.CountryID} 
                                            value={country.CountryID}
                                            className="bg-gray-900 text-white"
                                        >
                                            {country.countryname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex flex-col items-start group md:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-white/70">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full px-4 py-3 text-sm cursor-pointer
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white/70
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-emerald-400/90 file:text-black
                                        hover:file:bg-emerald-400
                                        transition-all duration-300"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className="text-red-400 text-sm 
                                bg-red-400/10 px-4 py-3 rounded-xl 
                                border border-red-400/20
                                flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-sm
                                bg-emerald-400/90 text-black font-medium
                                rounded-xl
                                hover:bg-emerald-400 
                                active:bg-emerald-500
                                focus:ring-2 focus:ring-emerald-400/20
                                transition-all duration-300
                                flex items-center justify-center gap-2
                                shadow-lg shadow-emerald-400/20
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

