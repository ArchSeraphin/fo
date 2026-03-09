import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function Partners() {
  const partners = [
    { name: 'Agence de la Biomédecine', type: 'Institutionnel', color: '#26365a' },
    { name: 'Ministère de la Santé', type: 'Institutionnel', color: '#ce232b' },
    { name: 'CHU de Paris', type: 'Hospitalier', color: '#26365a' },
    { name: 'Fondation pour la Recherche', type: 'Académique', color: '#f0a500' },
    { name: 'Croix-Rouge française', type: 'Associatif', color: '#ce232b' },
    { name: 'France Assos Santé', type: 'Associatif', color: '#26365a' },
  ];

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
            <span className="section-label">Un réseau solide</span>
            <h2>Ils nous font confiance</h2>
            <div className="section-divider" />
          </div>
          <div className="partners-grid reveal">
            {partners.map((p, i) => (
              <div key={i} className="partner-item" style={{ flexDirection: 'column', gap: '0.5rem', minHeight: '100px' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: p.color,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.875rem',
                  fontFamily: 'var(--font-display)',
                }}>
                  {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textAlign: 'center', margin: 0 }}>{p.name}</p>
                <span className="card-tag">{p.type}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '4rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center' }} className="reveal">
            <h3 style={{ marginBottom: '1rem' }}>Vous souhaitez devenir partenaire ?</h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              France Organes est ouverte à de nouveaux partenariats avec des organisations partageant nos valeurs.
            </p>
            <a href="/contact" className="btn btn-primary">Prendre contact</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
