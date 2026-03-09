import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch('/api/partners')
      .then(r => r.json())
      .then(data => setPartners(data || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <ScrollReveal />

      <div className="page-header">
        <div className="container">
          <h1>Nos partenaires</h1>
          <p>Ensemble, nous agissons pour le don d'organes</p>
        </div>
      </div>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Ils nous soutiennent</span>
            <h2>Nos partenaires</h2>
            <div className="section-divider" />
          </div>
          {partners.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>Aucun partenaire pour le moment.</p>
          ) : (
            <div className="partners-grid reveal">
              {partners.map(p => (
                <div key={p.id} className="partner-item" style={{ flexDirection: 'column', gap: '0.5rem', minHeight: '110px' }}>
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} style={{ height: '52px', maxWidth: '120px', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)' }}>
                      {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  {p.website ? (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textAlign: 'center' }}>{p.name}</a>
                  ) : (
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textAlign: 'center', margin: 0 }}>{p.name}</p>
                  )}
                  <span className="card-tag">{p.type}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '4rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center' }} className="reveal">
            <h3 style={{ marginBottom: '1rem' }}>Vous souhaitez devenir partenaire ?</h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              FranceOrganes est ouverte à de nouveaux partenariats avec des structures partageant notre engagement pour les enfants hospitalisés.
            </p>
            <a href="/contact" className="btn btn-primary">Prendre contact</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
