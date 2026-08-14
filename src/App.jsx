import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Financing from './pages/Financing';
import Ventures from './pages/Ventures';
import { isFrenchPath } from './lib/routes';

// Makes the URL the source of truth for language: any navigation (a clicked link,
// back/forward, a typed URL) re-syncs i18next's active language to whatever the
// path implies, rather than leaving it to drift from a stale toggle click.
function LocaleFromUrl() {
  const { i18n } = useTranslation();
  const location = useLocation();
  React.useEffect(() => {
    const lang = isFrenchPath(location.pathname) ? 'fr' : 'en';
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [location.pathname, i18n]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleFromUrl />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fr" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/fr/blogue" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/fr/blogue/:slug" element={<BlogPost />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/fr/financement" element={<Financing />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="/fr/ventures" element={<Ventures />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
