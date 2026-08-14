import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en';
import fr from '../locales/fr';
import { isFrenchPath } from './routes';

// The URL is the source of truth for language (see routes.js) — not a remembered
// cross-visit preference, which would otherwise fight with it (a stale French
// preference "winning" for a moment on a plain /blog load). Reading the path here,
// synchronously before React mounts, means first paint already matches the URL
// instead of flashing English and then correcting once App's LocaleFromUrl effect
// runs.
const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: isFrenchPath(initialPath) ? 'fr' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
