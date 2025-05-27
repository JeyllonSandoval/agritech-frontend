"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/languageContext';
import formsTranslations from '@/data/Lenguage/en/forms.json';

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

interface ValidationErrors {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    password?: string;
    confirmPassword?: string;
    CountryID?: string;
    image?: string;
}

export default function RegisterForm() {
    const router = useRouter();
    const { language } = useLanguage();
    const translations = formsTranslations.register;
    const commonTranslations = formsTranslations.common;
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
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const firstInputRef = useRef<HTMLInputElement>(null);

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
            setMessage(commonTranslations.passwordMismatch);
        } else {
            setMessage("");
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    // Validación en tiempo real
    const validateField = (name: string, value: string) => {
        let error = '';
        
        switch (name) {
            case 'FirstName':
                if (!value.trim()) {
                    error = commonTranslations.required;
                } else if (value.length < 2) {
                    error = commonTranslations.minLength.replace('{length}', '2');
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    error = 'First name can only contain letters';
                }
                break;

            case 'LastName':
                if (!value.trim()) {
                    error = commonTranslations.required;
                } else if (value.length < 2) {
                    error = commonTranslations.minLength.replace('{length}', '2');
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    error = 'Last name can only contain letters';
                }
                break;

            case 'Email':
                if (!value) {
                    error = commonTranslations.required;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = commonTranslations.invalidEmail;
                }
                break;

            case 'password':
                if (!value) {
                    error = commonTranslations.required;
                } else if (value.length < 8) {
                    error = commonTranslations.minLength.replace('{length}', '8');
                }
                break;

            case 'confirmPassword':
                if (!value) {
                    error = commonTranslations.required;
                } else if (value !== password) {
                    error = commonTranslations.passwordMismatch;
                }
                break;

            case 'CountryID':
                if (!value) {
                    error = commonTranslations.required;
                }
                break;
        }

        return error;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, 
            field === 'confirmPassword' ? confirmPassword :
            field === 'FirstName' ? FirstName :
            field === 'LastName' ? LastName :
            field === 'Email' ? Email :
            field === 'password' ? password :
            field === 'CountryID' ? CountryID : ''
        );
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleChange = (field: string, value: string) => {
        // Actualizar el estado correspondiente
        switch (field) {
            case 'FirstName':
                setFirstName(value);
                break;
            case 'LastName':
                setLastName(value);
                break;
            case 'Email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'CountryID':
                setCountryID(value);
                break;
        }

        // Si el campo ya ha sido tocado, validar en tiempo real
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage(commonTranslations.passwordMismatch);
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
                setMessage(data.message || data.error || commonTranslations.error);
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setMessage(commonTranslations.error);
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
        <section className="w-full h-full flex justify-center items-center">
            <form onSubmit={handleRegister} 
                className={`w-full max-w-2xl p-4 md:p-8 
                    bg-white/10 backdrop-blur-xl rounded-2xl 
                    border border-white/20 shadow-lg
                    transition-opacity duration-300
                    ${isSubmitting ? 'opacity-75' : 'opacity-100'}`}
            >
                <div className="flex flex-col items-center gap-4 md:gap-8">
                    <div className="text-center space-y-1 md:space-y-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-white">
                            {translations.title}
                        </h1>
                        <p className="text-xs md:text-sm text-white/70">
                            {translations.subtitle}
                        </p>
                    </div>

                    <div className="w-full space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative flex items-center">
                                    <input
                                        ref={firstInputRef}
                                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300"
                                        type="text"
                                        placeholder={translations.name}
                                        value={FirstName}
                                        onChange={(e) => handleChange('FirstName', e.target.value)}
                                        onBlur={() => handleBlur('FirstName')}
                                    />
                                    {touched.FirstName && errors.FirstName && (
                                        <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                            {errors.FirstName}
                                        </div>
                                    )}
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300"
                                        type="text"
                                        placeholder={translations.name}
                                        value={LastName}
                                        onChange={(e) => handleChange('LastName', e.target.value)}
                                        onBlur={() => handleBlur('LastName')}
                                    />
                                    {touched.LastName && errors.LastName && (
                                        <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                            {errors.LastName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    type="email"
                                    placeholder={translations.email}
                                    value={Email}
                                    onChange={(e) => handleChange('Email', e.target.value)}
                                    onBlur={() => handleBlur('Email')}
                                />
                                {touched.Email && errors.Email && (
                                    <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                        {errors.Email}
                                    </div>
                                )}
                            </div>

                            <div className="relative group">
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300
                                            pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={translations.password}
                                        value={password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        onBlur={() => handleBlur('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 md:right-3 
                                            p-1 md:p-1.5 rounded-lg
                                            text-white/40
                                            hover:text-emerald-400/70
                                            hover:bg-emerald-400/10
                                            active:bg-emerald-400/20
                                            transition-all duration-300
                                            focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="relative group">
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                            bg-white/10 backdrop-blur-sm rounded-xl
                                            border border-white/20 text-white
                                            group-hover:border-emerald-400/30
                                            focus:border-emerald-400/50 focus:ring-2 
                                            focus:ring-emerald-400/20 focus:outline-none 
                                            placeholder-white/40
                                            transition-all duration-300
                                            pr-12"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={translations.confirmPassword}
                                        value={confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        onBlur={() => handleBlur('confirmPassword')}
                                    />
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                        {errors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            <div className="relative flex items-center">
                                <select
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300"
                                    value={CountryID}
                                    onChange={(e) => handleChange('CountryID', e.target.value)}
                                    onBlur={() => handleBlur('CountryID')}
                                >
                                    <option value="">Select your country</option>
                                    {countries.map((country) => (
                                        <option key={country.CountryID} value={country.CountryID}>
                                            {country.countryname}
                                        </option>
                                    ))}
                                </select>
                                {touched.CountryID && errors.CountryID && (
                                    <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                                        {errors.CountryID}
                                    </div>
                                )}
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                        bg-white/10 backdrop-blur-sm rounded-xl
                                        border border-white/20 text-white
                                        group-hover:border-emerald-400/30
                                        focus:border-emerald-400/50 focus:ring-2 
                                        focus:ring-emerald-400/20 focus:outline-none 
                                        placeholder-white/40
                                        transition-all duration-300
                                        cursor-pointer
                                        flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {image ? image.name : 'Upload Profile Picture'}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm
                                    bg-emerald-400/90 text-black font-medium
                                    rounded-xl
                                    hover:bg-emerald-400 
                                    active:bg-emerald-500
                                    focus:ring-2 focus:ring-emerald-400/20
                                    transition-all duration-300
                                    flex items-center justify-center gap-2
                                    shadow-lg shadow-emerald-400/20
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{commonTranslations.loading}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{translations.signUp}</span>
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {message && (
                                <div className="text-xs md:text-sm 
                                    bg-red-400/10 px-3 py-2 md:px-4 md:py-3 rounded-xl 
                                    border border-red-400/20
                                    flex items-center gap-2"
                                >
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="flex-1">{message}</span>
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-xs md:text-sm text-white/50">
                                    {translations.haveAccount}{' '}
                                    <button
                                        type="button"
                                        onClick={() => router.push('/login')}
                                        className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                                    >
                                        {translations.signIn}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}

