import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  const team = [
    { initials: 'AS', name: 'Audrey SUAIRE', role: 'Présidente & Fondatrice' },
    { initials: 'M', name: 'Marie', role: 'Co-fondatrice' },
    { initials: 'FA', name: 'Fanny', role: 'Bénévole référente' },
    { initials: 'AR', name: 'Arnaud', role: 'Référent événements' },
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
              <h2>Une association née d'un élan du cœur</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                FranceOrganes est née le 4 mai 2009, quelques semaines après l'élection de la première Miss FranceOrganes le 28 mars 2009. Audrey SUAIRE, élue miss, et Marie, alors en attente d'une greffe de rein, ont fondé l'association avec une conviction simple : aucun enfant hospitalisé ne devrait se sentir seul.
              </p>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Depuis plus de 16 ans, nos bénévoles — de 6 à 62 ans — sillonnent les marchés, foires et galas pour récolter des fonds et offrir du répit aux enfants et à leurs familles. Stands de vente, lotos, expositions Lego, concours de chant... chaque initiative compte.
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
                "Je ne suis que la locomotive d'un sacré TGV. Sans vous tous, rien ne serait pareil." — Audrey SUAIRE, présidente
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
              { icon: '🎗️', title: 'Générosité', desc: 'Chaque geste compte. De la vente d\'un stylo sur un stand à l\'organisation d\'un grand loto, tout est fait avec le cœur pour les enfants.' },
              { icon: '💪', title: 'Persévérance', desc: 'Depuis 2009, envers et contre tout — même le Covid — nous continuons à nous battre pour que chaque enfant hospitalisé sente qu\'on pense à lui.' },
              { icon: '🤝', title: 'Solidarité', desc: 'Bénévoles, partenaires, donateurs : c\'est un vrai réseau humain qui se mobilise pour offrir des moments de bonheur aux enfants et du répit aux parents.' },
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
