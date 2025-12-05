import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white card-shadow hover:shadow-md transition-all">
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-exo font-medium text-gray-700">
          {languages.find(lang => lang.code === i18n.language)?.flag}
        </span>
        <span className="text-sm font-exo font-medium text-gray-700">
          {languages.find(lang => lang.code === i18n.language)?.name}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 bg-white card-shadow rounded-lg py-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-exo hover:bg-gray-50 transition-colors ${
              i18n.language === language.code ? 'text-bsc-600 bg-bsc-50' : 'text-gray-700'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher