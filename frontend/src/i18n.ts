import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

export const languages = {
  "en": "English",
  "hi": "हिंदी",
  "kn": "ಕನ್ನಡ"
};

const numberMapping: { [key: string]: string[] } = {
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  // Add more languages
};

i18n
  .use(initReactI18next) // Connects i18next with React
  .use(LanguageDetector) // Detects the user's language
  .use(HttpApi) // Loads translations via HTTP
  .init({
    fallbackLng: 'en', // Default language
    supportedLngs: Object.keys(languages), // Supported languages
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes content
    },
  });

// Custom function to convert numbers dynamically based on the current language
export const convertNumber = (number: number): string => {
  const currentLanguage = i18n.language;
  const mapping = numberMapping[currentLanguage];

  if (mapping) {
    return String(number)
      .split('')
      .map(digit => mapping[+digit] || digit)
      .join('');
  }

  return String(number);
};

export default i18n;
