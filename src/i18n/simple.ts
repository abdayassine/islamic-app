import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Traductions simples
const resources = {
  fr: {
    translation: {
      home: {
        title: "IslamApp",
        subtitle: "Application Islamique Moderne"
      },
      navigation: {
        home: "🏠 Accueil",
        prayertimes: "🕐 Horaires",
        surahs: "📖 Souras",
        qiblah: "🧭 Qibla",
        auth: "👤 Connexion"
      }
    }
  },
  ar: {
    translation: {
      home: {
        title: "إسلام آب",
        subtitle: "التطبيق الإسلامي الحديث"
      },
      navigation: {
        home: "🏠 الصفحة الرئيسية",
        prayertimes: "🕐 مواقيت الصلاة",
        surahs: "📖 السور",
        qiblah: "🧭 القبلة",
        auth: "👤 تسجيل الدخول"
      }
    }
  },
  en: {
    translation: {
      home: {
        title: "IslamApp",
        subtitle: "Modern Islamic Application"
      },
      navigation: {
        home: "🏠 Home",
        prayertimes: "🕐 Prayer Times",
        surahs: "📖 Surahs",
        qiblah: "🧭 Qibla",
        auth: "👤 Login"
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: 'fr',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    }
  })

export default i18n