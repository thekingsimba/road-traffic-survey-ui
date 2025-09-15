import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '../src/locales/en.json';
import frTranslations from '../src/locales/fr.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          ...enTranslations,
        },
      },
      fr: {
        translation: {
          ...frTranslations,
        },
      },
    },
    fallbackLng: 'fr',
    supportedLngs: ['en', 'fr'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
