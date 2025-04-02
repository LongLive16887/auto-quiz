import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Подключаем загрузку переводов
  .use(LanguageDetector) // Автоматически определяет язык
  .use(initReactI18next) // Подключаем к React
  .init({
    fallbackLng: "uz", // Язык по умолчанию
    debug: true,
    interpolation: {
      escapeValue: false, // Отключаем экранирование HTML
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json" // Где лежат файлы переводов
    }
  });

export default i18n;
