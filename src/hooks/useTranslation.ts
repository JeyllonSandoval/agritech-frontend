import { useLanguage } from '@/context/languageContext';

type TranslationKey = string;
type TranslationValue = string;

interface Translations {
    [key: string]: any;
}

const translations: Record<string, Translations> = {
    en: {},
    es: {},
};

export function useTranslation() {
    const { language } = useLanguage();

    const t = (key: TranslationKey): TranslationValue => {
        const keys = key.split('.');
        let value: any = translations[language];
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }
        return typeof value === 'string' ? value : key;
    };

    const loadTranslations = async (namespace: string) => {
        try {
            const module = await import(`@/data/Lenguage/${language}/${namespace}.json`);
            translations[language] = {
                ...translations[language],
                ...module.default,
            };
        } catch (error) {
            console.error(`Failed to load translations for ${namespace}:`, error);
        }
    };

    // Expose the full translation object for the current language
    const getNamespace = () => {
        return translations[language];
    };

    return {
        t,
        loadTranslations,
        getNamespace,
    };
} 