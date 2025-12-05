import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation files
import enCommon from '../locales/en/common.json'
import zhCommon from '../locales/zh/common.json'

const resources = {
  en: {
    common: enCommon
  },
  zh: {
    common: zhCommon
  }
}

// Initialize with saved language or default to English
const savedLanguage = localStorage.getItem('language') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: false,

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common'],

    interpolation: {
      escapeValue: false // React already does escaping
    },

    // React options
    react: {
      useSuspense: false
    }
  })

// Save language change to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n