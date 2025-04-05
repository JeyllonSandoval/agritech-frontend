import React, { useState, useEffect } from 'react';

interface EditFormProps {
    initialValue: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
    title: string;
}

export const EditForm: React.FC<EditFormProps> = ({
    initialValue,
    onSubmit,
    onCancel,
    title
}) => {
    const [value, setValue] = useState(initialValue);
    const [validations, setValidations] = useState({
        length: false,
        noSpecialChars: false
    });

    useEffect(() => {
        setValidations({
            length: value.length >= 3 && value.length <= 50,
            noSpecialChars: /^[a-zA-Z0-9\s-_]+$/.test(value)
        });
    }, [value]);

    const isFormValid = validations.length && validations.noSpecialChars;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6 text-xl">
            <h2 className="text-xl font-medium text-white/90">{title}</h2>
            <div className="relative flex flex-col gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-3 text-xl
                        bg-white/10 backdrop-blur-sm rounded-xl
                        border border-white/20 text-white
                        focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20
                        focus:outline-none placeholder-white/40
                        transition-all duration-300"
                    required
                />
                
                {/* Validadores dinámicos */}
                <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${
                        validations.length ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.length ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>Between 3 and 50 characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                        validations.noSpecialChars ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {validations.noSpecialChars ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                        </svg>
                        <span>Only letters, numbers, spaces, hyphens and underscores</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-white/70 hover:text-white/90 
                        transition-colors rounded-lg"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-4 py-2 rounded-lg transition-all duration-300
                        ${!isFormValid
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-emerald-400/90 text-black hover:bg-emerald-400'
                        }`}
                >
                    Save
                </button>
            </div>
        </form>
    );
};
