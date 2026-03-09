import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  const team = [
    { initials: 'ML', name: 'Marie Laurent', role: 'Présidente' },
    { initials: 'PD', name: 'Pierre Dumont', role: 'Secrétaire général' },
    { initials: 'SC', name: 'Sophie Carlier', role: 'Trésorière' },
    { initials: 'JM', name: 'Jean Martin', role: 'Référent médical' },
  ];

  return (
    <>
      <Navbar />
      <ScrollReveal />

      <div className="page-header">
        <div className="container">
          <h1>À propos de nous</h1>
          <p>Une association engagée pour le don d'organes depuis 2010</p>
        </div>
      </div>

      {/* HISTOIRE */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Notre histoire</span>
              <h2>Une association née de la nécessité</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                Fondée en 2010 par d'anciens patients greffés et des proches de donneurs, France Organes est née de la conviction que chaque vie mérite d'être soutenue et que le don d'organes est un acte de solidarité essentiel.
              </p>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Depuis sa création, notre association a accompagné des milliers de familles et contribué à faire évoluer les mentalités autour du don d'organes en France.
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Rejoignez-nous</Link>
            </div>
            <div className="reveal-right" style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🫀</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                "Parce que derrière chaque greffe, il y a une famille qui a fait le choix de la générosité."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">L'équipe</span>
            <h2>Ceux qui portent la mission</h2>
            <div className="section-divider" />
          </div>
          <div className="team-grid">
            {team.map((m, i) => (
              <div key={i} className={`team-card reveal reveal-delay-${i + 1}`}>
                <div className="team-avatar">{m.initials}</div>
                <h4>{m.name}</h4>
                <p style={{ color: 'var(--color-secondary)', fontSize: '0.875rem', fontWeight: 600, margin: '0.25rem 0 0' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Ce qui nous guide</span>
            <h2>Nos valeurs</h2>
            <div className="section-divider" />
          </div>
          <div className="features-grid">
            {[
              { icon: '🤲', title: 'Solidarité', desc: 'Nous croyons en la force du collectif pour soutenir ceux qui en ont besoin.' },
              { icon: '🔍', title: 'Transparence', desc: 'Nous rendons compte de notre action de façon claire et honnête à nos membres et partenaires.' },
              { icon: '💪', title: 'Engagement', desc: 'Chaque membre de notre équipe agit avec conviction pour faire avancer la cause du don d\'organes.' },
            ].map((v, i) => (
              <div key={i} className={`feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-icon">{v.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
