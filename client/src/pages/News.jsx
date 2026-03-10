import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function News() {
  const [data, setData] = useState({ articles: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?page=${page}&limit=9`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Navbar />
      <ScrollReveal />

      <div className="page-header">
        <div className="container">
          <h1>Actualités</h1>
          <p>Suivez les actions et nouvelles de France Organes</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : data.articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '1.125rem' }}>Aucune actualité pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {data.articles.map((article, i) => (
                  <article key={article.id} className={`card reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                    <div className="card-img-placeholder">
                      {article.cover_image
                        ? <img src={article.cover_image} alt={article.title} className="card-img" />
                        : <span style={{ fontSize: '2.5rem' }}>📰</span>}
                    </div>
                    <div className="card-body">
                      <div className="card-meta">
                        <span className="card-tag">Actualité</span>
                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <h3 className="card-title">
                        <Link to={`/actualites/${article.slug}`} className="card-stretched-link">{article.title}</Link>
                      </h3>
                      {article.excerpt && <p className="card-excerpt">{article.excerpt}</p>}
                      <span className="card-link" aria-hidden="true">Lire l'article</span>
                    </div>
                  </article>
                ))}
              </div>

              {data.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                      className="btn btn-sm"
                      style={{
                        background: p === page ? 'var(--color-primary)' : 'white',
                        color: p === page ? 'white' : 'var(--color-primary)',
                        border: '1.5px solid var(--color-primary)',
                        minWidth: '40px',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
