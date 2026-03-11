import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';

export default function AdminDashboard() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ articles: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(() => {
    fetch('/api/admin/articles?limit=50', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchArticles();
  };

  const handleToggle = async (id) => {
    await fetch(`/api/admin/articles/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
    fetchArticles();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('/admin/connexion', { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/img/logo/france-organes-logo-blanc.webp" alt="France Organes" />
          <span>Administration</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/tableau-de-bord" className="admin-nav-link active">📰 Actualités</Link>
          <Link to="/admin/partenaires" className="admin-nav-link">🤝 Partenaires</Link>
          <Link to="/admin/analytics" className="admin-nav-link">📊 Analytics</Link>
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <Link to="/" style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>← Voir le site</Link>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.875rem', width: '100%' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>Gestion des actualités</h2>
          <Link to="/admin/articles/nouveau" className="btn btn-primary btn-sm">+ Nouvel article</Link>
        </div>

        <div className="admin-content">
          <div className="admin-card">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
            ) : data.articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <p>Aucun article. <Link to="/admin/articles/nouveau" style={{ color: 'var(--color-primary)' }}>Créer le premier</Link></p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.articles.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 500, maxWidth: '300px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/actualites/{a.slug}</div>
                        </td>
                        <td>
                          <span className={`badge ${a.published ? 'badge-success' : 'badge-warning'}`}>
                            {a.published ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                          {new Date(a.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <div className="admin-actions">
                            <Link to={`/admin/articles/${a.id}/modifier`} className="btn-icon btn-icon-edit" title="Modifier">✏️</Link>
                            <button onClick={() => handleToggle(a.id)} className="btn-icon btn-icon-toggle" title={a.published ? 'Dépublier' : 'Publier'}>
                              {a.published ? '👁️' : '🚀'}
                            </button>
                            <button onClick={() => handleDelete(a.id, a.title)} className="btn-icon btn-icon-delete" title="Supprimer">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
