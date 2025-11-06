import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import frTranslations from './locales/fr.json'
import arTranslations from './locales/ar.json'
import enTranslations from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslations
      },
      ar: {
        translation: arTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'fr',
    lng: 'fr', // default language
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false // React already does escaping
    }
  })

export default i18n