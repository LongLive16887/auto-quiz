import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
	.use(HttpBackend) // Подключаем загрузку переводов
	.use(initReactI18next) // Подключаем к React
	.init({
		fallbackLng: 'la', // Язык по умолчанию
		debug: true,
		interpolation: {
			escapeValue: false, // Отключаем экранирование HTML
		},
		backend: {
			loadPath: '/locales/{{lng}}/translation.json', // Где лежат файлы переводов
		},
	})

export default i18n
