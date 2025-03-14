"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

    const [countries, setCountries] = useState<Country[]>([]);
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [CountryID, setCountryID] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();

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
                window.dispatchEvent(new Event('loginStateChange'));
                router.push("/");
            } else {
                setMessage(data.message || data.error || "Error en el registro");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setMessage("Error de conexión con el servidor");
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <section className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <h1 className="text-4xl m-0 p-0">Register</h1>
            <p className="text-lg m-0 p-0">Create an account to get started</p>
            <form onSubmit={handleRegister} className="flex flex-col gap-4 items-center justify-center text-2xl w-1/2">
                <input 
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    type="text" 
                    placeholder="First Name" 
                />
                <input 
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    type="text" 
                    placeholder="Last Name" 
                />
                <input 
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    type="text" 
                    placeholder="Email" 
                />
                <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    type="password" 
                    placeholder="Password" 
                />
                <input 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    type="password" 
                    placeholder="Confirm Password" 
                />
                <select 
                    value={CountryID}
                    onChange={(e) => setCountryID(e.target.value)}
                    name="CountryID" 
                    id="CountryID"
                    className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3"
                >
                    <option value="">Select a country</option>
                    {countries && countries.map((country) => (
                        <option key={country.CountryID} value={country.CountryID}
                        >
                            {country.countryname}
                        </option>
                    ))}
                </select>
                <div className="flex gap-4">
                    <input 
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-1/2 h-1/2 rounded-lg text-center text-black text-2xl p-3" 
                    />
                </div>
                <button className="w-1/2 h-1/2 rounded-lg text-center text-white custom-bg2 text-2xl p-3 hover:scale-105 transition-all duration-300 ease-in-out" type="submit">Register</button>
            </form>
            <p className="text-red-500 text-center text-2xl">{message}</p>
        </section>
    )
}

