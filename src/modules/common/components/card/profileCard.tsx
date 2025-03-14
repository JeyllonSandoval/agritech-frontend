"use client";
import { useState, useEffect } from "react";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full h-full flex justify-center items-center text-5xl">
            {userData && (
                <section className="flex flex-col items-center justify-center gap-4">
                    <img
                        src={userData.imageUser}
                        alt={`${userData.FirstName} ${userData.LastName}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                    />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {userData.FirstName} {userData.LastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Rol: {userData.RoleID}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        País: {userData.CountryID}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Email: {userData.Email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Fecha de creación: {userData.createdAt}
                    </p>
                    <p className={`text-sm font-semibold px-3 py-1 rounded-full ${userData.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                        {userData.status === "active" ? "Activo" : "Inactivo"}
                    </p>
                </section>
            )}
        </div>
    );
}

