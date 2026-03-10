import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';

export default function PartnersDashboard() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = useCallback(() => {
    fetch('/api/admin/partners', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setPartners(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    await fetch(`/api/admin/partners/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchPartners();
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
          <Link to="/gestion/tableau-de-bord" className="admin-nav-link">📰 Actualités</Link>
          <Link to="/gestion/partenaires" className="admin-nav-link active">🤝 Partenaires</Link>
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
          <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>Gestion des partenaires</h2>
          <Link to="/gestion/partenaires/nouveau" className="btn btn-primary btn-sm">+ Nouveau partenaire</Link>
        </div>

        <div className="admin-content">
          <div className="admin-card">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
            ) : partners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <p>Aucun partenaire. <Link to="/gestion/partenaires/nouveau" style={{ color: 'var(--color-primary)' }}>Ajouter le premier</Link></p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Ordre</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map(p => (
                    <tr key={p.id}>
                      <td style={{ width: '60px' }}>
                        {p.logo_url ? (
                          <img src={p.logo_url} alt={p.name} style={{ height: '36px', width: '56px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', background: '#f5f5f5', padding: '2px' }} />
                        ) : (
                          <div style={{ width: '56px', height: '36px', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                            {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>
                        {p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>{p.name}</a> : p.name}
                      </td>
                      <td><span className="card-tag">{p.type}</span></td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{p.display_order}</td>
                      <td>
                        <span className={`badge ${p.active ? 'badge-success' : 'badge-warning'}`}>
                          {p.active ? 'Visible' : 'Masqué'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/partenaires/${p.id}/modifier`} className="btn-icon btn-icon-edit" title="Modifier">✏️</Link>
                          <button onClick={() => handleDelete(p.id, p.name)} className="btn-icon btn-icon-delete" title="Supprimer">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            💡 Modifiez le champ "Ordre" pour changer la position d'affichage sur le site (0 = en premier).
          </p>
        </div>
      </main>
    </div>
  );
}
