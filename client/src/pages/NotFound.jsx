import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page introuvable" noindex={true} />
      <Navbar />

      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page introuvable</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Cette page n'existe pas ou a été déplacée. Revenez à l'accueil pour continuer votre navigation.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">Retour à l'accueil</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
