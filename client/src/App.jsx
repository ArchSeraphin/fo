import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ArticleEditor from './pages/admin/ArticleEditor';
import PartnersDashboard from './pages/admin/PartnersDashboard';
import PartnerEditor from './pages/admin/PartnerEditor';
import Analytics from './pages/admin/Analytics';
import CookieBanner from './components/CookieBanner';

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'France Organes',
  alternateName: 'FranceOrganes',
  url: 'https://franceorganes.fr',
  logo: 'https://franceorganes.fr/img/logo/logo-france-organe.png',
  foundingDate: '2009-05-04',
  description: 'Association nationale soutenant les enfants hospitalisés en attente de greffe d\'organes et sensibilisant au don d\'organes.',
  email: 'contact@franceorganes.fr',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@franceorganes.fr',
    contactType: 'customer support',
    availableLanguage: 'French',
  },
  areaServed: 'FR',
  // Ajouter ici les URLs des réseaux sociaux quand disponibles
  // sameAs: ['https://www.facebook.com/...', 'https://www.helloasso.com/...'],
  sameAs: [],
};

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/admin/connexion" replace />;
}

function GoogleAnalytics({ consent }) {
  useEffect(() => {
    if (!consent) return;
    if (window.__GA_LOADED__) return;
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        const id = data.ga_measurement_id;
        if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
        window.__GA_LOADED__ = true;
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        script.async = true;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', id);
      })
      .catch(() => {});
  }, [consent]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(
    () => localStorage.getItem('cookieConsent') === 'true'
  );
  const [showBanner, setShowBanner] = useState(
    () => localStorage.getItem('cookieConsent') === null
  );

  useEffect(() => {
    fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser({ loggedIn: true });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setCookieConsent(true);
    setShowBanner(false);
  };

  const handleRefuseCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowBanner(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      </Helmet>
      <AuthContext.Provider value={{ user, setUser, loading }}>
        <GoogleAnalytics consent={cookieConsent} />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/actualites/:slug" element={<NewsDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partenaires" element={<Partners />} />
            <Route path="/mentions-legales" element={<Legal />} />
            <Route path="/gestion" element={<Navigate to="/admin/connexion" replace />} />
            <Route path="/admin/connexion" element={<AdminLogin />} />
            <Route path="/admin/tableau-de-bord" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/articles/nouveau" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/admin/articles/:id/modifier" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/admin/partenaires" element={<ProtectedRoute><PartnersDashboard /></ProtectedRoute>} />
            <Route path="/admin/partenaires/nouveau" element={<ProtectedRoute><PartnerEditor /></ProtectedRoute>} />
            <Route path="/admin/partenaires/:id/modifier" element={<ProtectedRoute><PartnerEditor /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {showBanner && (
            <CookieBanner onAccept={handleAcceptCookies} onRefuse={handleRefuseCookies} />
          )}
        </BrowserRouter>
      </AuthContext.Provider>
    </HelmetProvider>
  );
}
