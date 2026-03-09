import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function Partners() {
  const partners = [
    { name: 'Lyon1950', type: 'Partenaire', color: '#26365a' },
    { name: 'ABD Basket', type: 'Partenaire', color: '#ce232b' },
    { name: "L'Animal Rit", type: 'Partenaire', color: '#26365a' },
    { name: "Association Poussière d'étoile", type: 'Partenaire', color: '#ce232b' },
    { name: 'Hôpital Femme Mère Enfant', type: 'Institutionnel', color: '#26365a' },
    { name: 'Hôpital Cardio de Lyon', type: 'Institutionnel', color: '#ce232b' },
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
            <span className="section-label">Ils nous soutiennent</span>
            <h2>Nos partenaires</h2>
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
