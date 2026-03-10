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
  areaServed: 'FR',
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
  return user ? children : <Navigate to="/gestion/connexion" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser({ loggedIn: true });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      </Helmet>
      <AuthContext.Provider value={{ user, setUser, loading }}>
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
            <Route path="/gestion" element={<Navigate to="/gestion/connexion" replace />} />
            <Route path="/gestion/connexion" element={<AdminLogin />} />
            <Route path="/gestion/tableau-de-bord" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/gestion/articles/nouveau" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/gestion/articles/:id/modifier" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/gestion/partenaires" element={<ProtectedRoute><PartnersDashboard /></ProtectedRoute>} />
            <Route path="/gestion/partenaires/nouveau" element={<ProtectedRoute><PartnerEditor /></ProtectedRoute>} />
            <Route path="/gestion/partenaires/:id/modifier" element={<ProtectedRoute><PartnerEditor /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </HelmetProvider>
  );
}
