import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    UserID: string;
}

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

export function useProfile() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [countryName, setCountryName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
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
                console.error('Error fetching profile:', err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return { userData, countryName, isLoading, error };
} 