import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Simple translations
const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Apps": "Apps",
      "News": "News",
      "Videos": "Videos",
      "About": "About",
      "Contact": "Contact",
      "Search": "Search...",
      "Admin": "Admin",
      "All Apps": "All Apps",
      "Top Rated": "Top Rated",
      "New Releases": "New Releases",
      "Trending": "Trending",
      "Categories": "Categories",
      "Privacy Policy": "Privacy Policy",
      "Terms of Service": "Terms of Service",
    }
  },
  es: {
    translation: {
      "Home": "Inicio",
      "Apps": "Aplicaciones",
      "News": "Noticias",
      "Videos": "Videos",
      "About": "Acerca de",
      "Contact": "Contacto",
      "Search": "Buscar...",
      "Admin": "Administración",
      "All Apps": "Todas las Aplicaciones",
      "Top Rated": "Mejor Valoradas",
      "New Releases": "Nuevos Lanzamientos",
      "Trending": "Tendencias",
      "Categories": "Categorías",
      "Privacy Policy": "Política de Privacidad",
      "Terms of Service": "Términos de Servicio",
    }
  },
  fr: {
    translation: {
      "Home": "Accueil",
      "Apps": "Applications",
      "News": "Nouvelles",
      "Videos": "Vidéos",
      "About": "À propos",
      "Contact": "Contact",
      "Search": "Rechercher...",
      "Admin": "Administrateur",
      "All Apps": "Toutes les Applications",
      "Top Rated": "Les Mieux Notées",
      "New Releases": "Nouvelles Sorties",
      "Trending": "Tendances",
      "Categories": "Catégories",
      "Privacy Policy": "Politique de Confidentialité",
      "Terms of Service": "Conditions d'Utilisation",
    }
  },
  hi: {
    translation: {
      "Home": "होम",
      "Apps": "ऐप्स",
      "News": "समाचार",
      "Videos": "वीडियो",
      "About": "के बारे में",
      "Contact": "संपर्क करें",
      "Search": "खोजें...",
      "Admin": "व्यवस्थापक",
      "All Apps": "सभी ऐप्स",
      "Top Rated": "शीर्ष रेटेड",
      "New Releases": "नई रिलीज़",
      "Trending": "रुझान",
      "Categories": "श्रेणियाँ",
      "Privacy Policy": "गोपनीयता नीति",
      "Terms of Service": "सेवा की शर्तें",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
