"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/modules/common/hooks/useProfile";
import { useModal } from "@/modules/common/context/modalContext";

interface Country {
    CountryID: string;
    countryname: string;
}

interface FormErrors {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    CountryID?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
}

interface FormData {
    FirstName: string;
    LastName: string;
    Email: string;
    CountryID: string;
    password: string;
    confirmPassword: string;
    imageUser: File | null;
}

const initialFormData: FormData = {
    FirstName: "",
    LastName: "",
    Email: "",
    CountryID: "",
    password: "",
    confirmPassword: "",
    imageUser: null
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
    return password.length >= 8;
};

export default function EditProfileForm() {
    const { userData, countryName, isLoading, error, refreshProfile } = useProfile();
    const { closeModal } = useModal();
    const [countries, setCountries] = useState<Country[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [initialData, setInitialData] = useState<Partial<FormData>>({});

    useEffect(() => {
        if (userData) {
            const initialUserData = {
                FirstName: userData.FirstName,
                LastName: userData.LastName,
                Email: userData.Email,
                CountryID: userData.CountryID,
            };
            setInitialData(initialUserData);
            setFormData({
                ...initialFormData,
                ...initialUserData
            });
        }
    }, [userData]);

    const fetchCountries = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/countries`);
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const validateField = (name: keyof FormData, value: string | File | null): string | undefined => {
        if (value === null || value instanceof File) return undefined;
        
        switch (name) {
            case 'FirstName':
            case 'LastName':
                return value.trim() === '' ? 'This field is required' : undefined;
            case 'Email':
                if (value.trim() === '') return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email';
                return undefined;
            case 'password':
                if (value && !validatePassword(value)) {
                    return 'Password must be at least 8 characters long';
                }
                return undefined;
            case 'confirmPassword':
                if (value && value !== formData.password) {
                    return 'Passwords do not match';
                }
                return undefined;
            case 'CountryID':
                return value === '' ? 'Please select a country' : undefined;
            default:
                return undefined;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const error = validateField(name as keyof FormData, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                imageUser: e.target.files![0]
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(key => {
            if (key !== 'imageUser') {
                const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
                if (error) {
                    newErrors[key as keyof FormErrors] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            
            // Compare and append only modified fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    // Skip if the value hasn't changed from initial data
                    if (key in initialData && value === initialData[key as keyof typeof initialData]) {
                        return;
                    }
                    
                    // For password fields, only send if they have been modified
                    if ((key === 'password' || key === 'confirmPassword') && value === '') {
                        return;
                    }

                    if (value instanceof File) {
                        formDataToSend.append(key, value);
                    } else {
                        formDataToSend.append(key, value.toString());
                    }
                }
            });

            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setErrors(prev => ({
                    ...prev,
                    submit: 'Authentication token not found'
                }));
                setIsSubmitting(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGRITECH_API_URL}/profile/${userData?.UserID}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update token if provided by the backend
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    // Dispatch a specific event for token update
                    window.dispatchEvent(new CustomEvent('token-updated'));
                }
                
                // Close modal immediately
                closeModal();
                // Dispatch event to update profile with the new user data
                window.dispatchEvent(new CustomEvent('profile-updated', {
                    detail: data.updatedUser[0] // Pass the updated user data
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: data.message || 'Please, change any field to update your profile'
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'An error occurred while updating your profile'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-white/70 text-xl">Loading...</div>;
    if (error) return <div className="text-red-400 text-xl">Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-xl">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${isSubmitting ? 'pointer-events-none opacity-75' : 'opacity-100'}`}>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">First Name</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                            errors.FirstName ? 'border-red-400/50' : 'border-white/20'
                        } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                        required
                    />
                    {errors.FirstName && (
                        <p className="text-red-400 text-sm">{errors.FirstName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Last Name</label>
                    <input
                        type="text"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                            errors.LastName ? 'border-red-400/50' : 'border-white/20'
                        } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                        required
                    />
                    {errors.LastName && (
                        <p className="text-red-400 text-sm">{errors.LastName}</p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-white/70">Email</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                            errors.Email ? 'border-red-400/50' : 'border-white/20'
                        } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                        required
                    />
                    {errors.Email && (
                        <p className="text-red-400 text-sm">{errors.Email}</p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-white/70">Country</label>
                    <select
                        name="CountryID"
                        value={formData.CountryID}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                            errors.CountryID ? 'border-red-400/50' : 'border-white/20'
                        } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        [&>option]:bg-gray-900 [&>option]:text-white
                        [&>option:hover]:bg-emerald-600 [&>option:hover]:text-white
                        [&>option:checked]:bg-emerald-700
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                        required
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country.CountryID} value={country.CountryID}>
                                {country.countryname}
                            </option>
                        ))}
                    </select>
                    {errors.CountryID && (
                        <p className="text-red-400 text-sm">{errors.CountryID}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                                    errors.password ? 'border-red-400/50' : 'border-white/20'
                                } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none pr-12
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                                    text-white/40 hover:text-white/70
                                    transition-colors duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/70">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                className={`w-full px-4 py-2 rounded-xl bg-white/10 border ${
                                    errors.confirmPassword ? 'border-red-400/50' : 'border-white/20'
                                } text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none pr-12
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                                    text-white/40 hover:text-white/70
                                    transition-colors duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-white/70">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white
                            file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                            file:text-sm file:font-medium file:bg-emerald-400/90 file:text-black
                            hover:file:bg-emerald-400
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {errors.submit && (
                <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl">
                    {errors.submit}
                </div>
            )}

            {isSuccess && (
                <div className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Profile updated successfully!
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`px-6 py-2 rounded-xl font-medium
                        ${isSubmitting 
                            ? 'bg-emerald-400/50 cursor-not-allowed' 
                            : isSuccess
                            ? 'bg-emerald-400 cursor-default'
                            : 'bg-emerald-400/90 hover:bg-emerald-400'
                        } text-black
                        focus:ring-2 focus:ring-emerald-400/20 focus:outline-none
                        transition-all duration-300`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </div>
                    ) : isSuccess ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
} 