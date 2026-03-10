import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const TYPES = ['Partenaire', 'Institutionnel', 'Hospitalier', 'Associatif', 'Académique', 'Sponsor'];

export default function PartnerEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', type: 'Partenaire', website: '', logo_url: '', display_order: 0, active: true });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    fetch('/api/admin/partners', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const p = (data || []).find(p => String(p.id) === String(id));
        if (p) {
          setForm({
            name: p.name || '',
            type: p.type || 'Partenaire',
            website: p.website || '',
            logo_url: p.logo_url || '',
            display_order: p.display_order ?? 0,
            active: !!p.active,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isEdit]);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const r = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body: formData });
      const data = await r.json();
      if (r.ok) setForm(p => ({ ...p, logo_url: data.url }));
      else setUploadError(data.error || "Erreur lors de l'upload");
    } catch {
      setUploadError('Erreur de connexion');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/admin/partners/${id}` : '/api/admin/partners';
      const method = isEdit ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) navigate('/gestion/partenaires');
      else setError(data.error || 'Erreur lors de la sauvegarde');
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
          <Link to="/gestion/tableau-de-bord" className="admin-nav-link">📰 Actualités</Link>
          <Link to="/gestion/partenaires" className="admin-nav-link active">🤝 Partenaires</Link>
          <Link to="/gestion/analytics" className="admin-nav-link">📊 Analytics</Link>
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <Link to="/" style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>← Voir le site</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/gestion/partenaires" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>← Retour</Link>
            <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>
              {isEdit ? 'Modifier le partenaire' : 'Nouveau partenaire'}
            </h2>
          </div>
          <button form="partner-form" type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>

        <div className="admin-content">
          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #ef5350', color: '#c62828', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <form id="partner-form" onSubmit={handleSubmit}>
            <div className="admin-card">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Nom du partenaire" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ordre d'affichage</label>
                  <input className="form-input" type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} min={0} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Site web</label>
                <input className="form-input" type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Logo</label>
                {form.logo_url && (
                  <div style={{ marginBottom: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img src={form.logo_url} alt="Logo" style={{ maxHeight: '80px', maxWidth: '200px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', display: 'block', objectFit: 'contain', background: '#f5f5f5', padding: '0.5rem' }} />
                    <button type="button" onClick={() => setForm(p => ({ ...p, logo_url: '' }))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ whiteSpace: 'nowrap' }}>
                    {uploading ? '⏳ Envoi...' : '📁 Choisir un logo'}
                  </button>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>ou</span>
                  <input className="form-input" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} placeholder="https://... (URL directe)" style={{ flex: 1, minWidth: '200px' }} />
                </div>
                {uploadError && <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>{uploadError}</p>}
              </div>
            </div>

            <div className="admin-card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Visible sur le site</span>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Le partenaire apparaît sur la page Partenaires</p>
                </div>
              </label>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
