import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
	.use(HttpBackend)
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		fallbackLng: 'la', // Если язык не найден, используем 'la'
		debug: true,
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: '/locales/{{lng}}/translation.json',
		},
		react: {
			useSuspense: false,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
		supportedLngs: ['la', 'ru', 'en'], // Используем supportedLngs вместо whitelist
		nonExplicitSupportedLngs: true, // Игнорировать суффиксы (например, 'ru-RU' → 'ru')
		lng: localStorage.getItem('i18nextLng') || 'la',
	})

export default i18n
