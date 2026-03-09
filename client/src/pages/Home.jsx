import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

function ArticleCard({ article }) {
  return (
    <article className="card reveal">
      <div className="card-img-placeholder">
        {article.cover_image
          ? <img src={article.cover_image} alt={article.title} className="card-img" />
          : <span style={{ fontSize: '2rem' }}>📰</span>}
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="card-tag">Actualité</span>
          <span>{new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        {article.excerpt && <p className="card-excerpt">{article.excerpt}</p>}
        <Link to={`/actualites/${article.slug}`} className="card-link">Lire l'article</Link>
      </div>
    </article>
  );
}

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles?limit=3')
      .then(r => r.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <ScrollReveal />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tag">🎗️ Association nationale de santé</div>
              <h1>Pour que la <em>vie</em> continue</h1>
              <p className="hero-subtitle">
                France Organes accompagne les patients en attente de greffe, soutient les familles de donneurs et sensibilise le grand public à l'importance du don d'organes.
              </p>
              <div className="hero-actions">
                <Link to="/a-propos" className="btn btn-primary btn-lg">Découvrir notre mission</Link>
                <Link to="/contact" className="btn btn-ghost btn-lg">Nous contacter</Link>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img
                src="/img/france-organe-enfant-home-2.png"
                alt="Enfant portant un cœur — France Organes"
                className="hero-image"
              />
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Défiler</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {[
              { number: '25 000+', label: 'personnes en attente de greffe' },
              { number: '6 000', label: 'greffes réalisées par an' },
              { number: '1 donneur', label: 'peut sauver jusqu\'à 8 vies' },
              { number: 'Depuis 2010', label: 'au service des patients' },
            ].map((s, i) => (
              <div key={i} className="stat-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSION */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Notre engagement</span>
            <h2>Ce que nous faisons</h2>
            <div className="section-divider" />
          </div>
          <div className="features-grid">
            {[
              { icon: '🫀', title: 'Accompagnement', desc: 'Nous soutenons les patients en attente de greffe et leurs proches tout au long de leur parcours médical et personnel.' },
              { icon: '🤝', title: 'Sensibilisation', desc: 'Nous animons des campagnes de sensibilisation pour encourager l\'inscription sur la liste de donneurs d\'organes.' },
              { icon: '📢', title: 'Plaidoyer', desc: 'Nous défendons les droits des patients et portons leur voix auprès des institutions sanitaires et gouvernementales.' },
            ].map((f, i) => (
              <div key={i} className={`feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      {articles.length > 0 && (
        <section className="section" style={{ background: 'white' }}>
          <div className="container">
            <div className="section-header reveal">
              <span className="section-label">Nos actualités</span>
              <h2>Dernières nouvelles</h2>
              <div className="section-divider" />
            </div>
            <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/actualites" className="btn btn-outline">Toutes les actualités</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="reveal">
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Agir maintenant</span>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ensemble, sauvons des vies</h2>
            <p>Votre soutien permet à France Organes de poursuivre sa mission d'accompagnement et de sensibilisation au don d'organes.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://www.helloasso.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Faire un don</a>
              <Link to="/contact" className="btn btn-ghost btn-lg">Nous rejoindre</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
