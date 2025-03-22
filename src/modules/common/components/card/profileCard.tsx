"use client";
import { useState, useEffect } from "react";

interface Country {
    CountryID: string;
    countryname: string;
}

interface UserData {
    UserID: string;
    RoleID: string;
    imageUser: string;
    FirstName: string;
    LastName: string;
    CountryID: string;
    Email: string;
    createdAt: string;
    status: string;
}

export default function ProfileCard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [countryName, setCountryName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                // Fetch user data
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const userDataResponse = await userResponse.json();
                const user = userDataResponse.user;
                setUserData(user);

                // Solo si tenemos el CountryID, hacemos la segunda llamada
                if (user?.CountryID) {
                    const countryResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/countries/${user.CountryID}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );

                    if (countryResponse.ok) {
                        const countryData = await countryResponse.json();
                        setCountryName(countryData.countryname);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                    <div className="text-white/70 text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-8">
                    <div className="text-red-400 text-2xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex justify-center items-center px-4">
            <div className="w-full max-w-md p-8 
                bg-white/10 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg">
                {userData && (
                    <section className="flex flex-col items-center space-y-6 ">
                        <div className="relative">
                            <div className="bg-white/40 backdrop-blur-sm rounded-full p-[2px]">
                                <div className="w-24 h-24 rounded-full overflow-hidden 
                                    bg-emerald-400/90 backdrop-blur-md shadow-xl shadow-emerald-300/90
                                    border-2 border-white/20">
                                    <img
                                        src={userData.imageUser}
                                        alt={`${userData.FirstName} ${userData.LastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full 
                                border-2 border-white/20 shadow-lg backdrop-blur-md
                                ${userData.status === "active" 
                                    ? "bg-emerald-400/90" 
                                    : "bg-red-400/90"}`}>
                            </span>
                        </div>
                        
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-white">
                                {userData.FirstName} {userData.LastName}
                            </h1>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center space-x-3 text-sm px-4 py-3
                                hover:bg-emerald-400/90 hover:text-black rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                                </svg>
                                <span>{countryName}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm px-4 py-3
                                hover:bg-emerald-400/90 hover:text-black rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>{userData.Email}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm px-4 py-3
                                hover:bg-emerald-400/90 hover:text-black rounded-xl
                                transition-all duration-300 text-white/70">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>{userData.createdAt}</span>
                            </div>
                        </div>

                        <div className="w-full border-t border-white/20">
                            <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm
                                transition-all duration-300
                                ${userData.status === "active" 
                                    ? "bg-emerald-400/90 text-black" 
                                    : "bg-red-400/90 text-white"}`}>
                                <span className={`w-2 h-2 mr-2 rounded-full bg-white/80`}></span>
                                {userData.status === "active" ? "Activo" : "Inactivo"}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

