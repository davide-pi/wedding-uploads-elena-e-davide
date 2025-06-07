import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import it from "./translations/it";
import ro from "./translations/ro";

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("lng") || "it",
  fallbackLng: "it",
  debug: false,

  interpolation: {
    escapeValue: false,
  },

  resources: {
    it: { translation: it },
    ro: { translation: ro },
  },
});

export default i18n;
