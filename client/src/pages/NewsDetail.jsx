import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then(r => { if (r.status === 404) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(data => { if (data) setArticle(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return <><Navbar /><div className="loading-screen"><div className="spinner" /></div></>;
  if (notFound) return (
    <>
      <Navbar />
      <div className="page-header"><div className="container"><h1>Article introuvable</h1></div></div>
      <div className="section" style={{ textAlign: 'center' }}>
        <Link to="/actualites" className="btn btn-primary">← Retour aux actualités</Link>
      </div>
      <Footer />
    </>
  );

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || '',
    image: article.cover_image ? `https://franceorganes.fr${article.cover_image}` : undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    author: { '@type': 'Organization', name: 'France Organes', url: 'https://franceorganes.fr' },
    publisher: { '@type': 'Organization', name: 'France Organes', url: 'https://franceorganes.fr' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://franceorganes.fr/actualites/${article.slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://franceorganes.fr' },
      { '@type': 'ListItem', position: 2, name: 'Actualités', item: 'https://franceorganes.fr/actualites' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://franceorganes.fr/actualites/${article.slug}` },
    ],
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt || `Lire l'article : ${article.title}`}
        canonical={`/actualites/${article.slug}`}
        image={article.cover_image}
        type="article"
        article={{ publishedAt: article.published_at, modifiedAt: article.updated_at }}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Navbar />

      <div className="page-header">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Actualités</span>
          <h1 style={{ maxWidth: '800px', margin: '0.5rem auto 1rem' }}>{article.title}</h1>
          {article.published_at && (
            <p>{new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
        </div>
      </div>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {article.cover_image && (
              <img src={article.cover_image} alt={article.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} />
            )}
            {article.excerpt && (
              <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', fontStyle: 'italic', borderLeft: '4px solid var(--color-secondary)', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                {article.excerpt}
              </p>
            )}
            <div
              className="article-content"
              style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--color-text)' }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <Link to="/actualites" className="btn btn-outline">← Retour aux actualités</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
