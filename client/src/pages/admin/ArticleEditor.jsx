import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import 'react-quill/dist/quill.snow.css';

// Lazy load react-quill to avoid SSR issues
const ReactQuill = lazy(() => import('react-quill'));

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image: '', published: false });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    // Fetch all articles and find by id
    fetch('/api/admin/articles?limit=200', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const article = (data.articles || []).find(a => String(a.id) === String(id));
        if (article) {
          // Need full content, fetch by slug
          fetch(`/api/articles/${article.slug}`, { credentials: 'include' })
            .then(r => r.json())
            .then(full => {
              setForm({
                title: full.title || '',
                excerpt: full.excerpt || '',
                content: full.content || '',
                cover_image: full.cover_image || '',
                published: !!full.published,
              });
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [id, isEdit]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/admin/articles/${id}` : '/api/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) {
        navigate('/admin/tableau-de-bord');
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch {
      setError('Erreur de connexion');
    }
    setSaving(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/img/logo/france-organes-logo-blanc.webp" alt="France Organes" />
          <span>Administration</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/tableau-de-bord" className="admin-nav-link">📰 Actualités</Link>
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <Link to="/" style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>← Voir le site</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/admin/tableau-de-bord" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>← Retour</Link>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>
              {isEdit ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>
          </div>
          <button form="article-form" type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Publier'}
          </button>
        </div>

        <div className="admin-content">
          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #ef5350', color: '#c62828', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <form id="article-form" onSubmit={handleSubmit}>
            <div className="admin-card">
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required style={{ fontSize: '1.125rem' }} placeholder="Titre de l'article" />
              </div>
              <div className="form-group">
                <label className="form-label">Résumé (chapô)</label>
                <textarea className="form-textarea" value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} style={{ minHeight: '80px' }} placeholder="Résumé affiché dans les listes..." />
              </div>
              <div className="form-group">
                <label className="form-label">Image de couverture (URL)</label>
                <input className="form-input" value={form.cover_image} onChange={e => setForm(p => ({ ...p, cover_image: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <div className="admin-card">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contenu *</label>
                <Suspense fallback={<div className="spinner" style={{ margin: '2rem auto' }} />}>
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={val => setForm(p => ({ ...p, content: val }))}
                    modules={QUILL_MODULES}
                    style={{ background: 'white', borderRadius: 'var(--radius-md)', minHeight: '300px' }}
                  />
                </Suspense>
              </div>
            </div>

            <div className="admin-card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Publier immédiatement</span>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>L'article sera visible sur le site dès la sauvegarde</p>
                </div>
              </label>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
