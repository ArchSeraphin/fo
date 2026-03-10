import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const [gaId, setGaId] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setGaId(data.ga_measurement_id || ''); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const trimmed = gaId.trim();
    if (trimmed && !/^G-[A-Z0-9]+$/.test(trimmed)) {
      setError('Format invalide. L\'ID doit commencer par G- (ex : G-XXXXXXXXXX)');
      setSaving(false);
      return;
    }
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ga_measurement_id: trimmed }),
      });
      if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError('Erreur lors de la sauvegarde');
    } catch {
      setError('Erreur de connexion');
    }
    setSaving(false);
  };

  const isConfigured = /^G-[A-Z0-9]+$/.test(gaId.trim());

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/img/logo/france-organes-logo-blanc.webp" alt="France Organes" />
          <span>Administration</span>
        </div>
        <nav className="admin-nav">
          <Link to="/gestion/tableau-de-bord" className="admin-nav-link">📰 Actualités</Link>
          <Link to="/gestion/partenaires" className="admin-nav-link">🤝 Partenaires</Link>
          <Link to="/gestion/analytics" className="admin-nav-link active">📊 Analytics</Link>
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <Link to="/" style={{ display: 'block', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>← Voir le site</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2 style={{ fontSize: '1.125rem', color: 'var(--color-primary)', margin: 0 }}>Google Analytics</h2>
          {isConfigured && (
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              Ouvrir Analytics ↗
            </a>
          )}
        </div>

        <div className="admin-content">
          {/* Statut */}
          <div className="admin-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
              background: isConfigured ? '#22c55e' : '#d1d5db',
            }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9375rem' }}>
                {isConfigured ? 'Google Analytics actif' : 'Google Analytics non configuré'}
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {isConfigured
                  ? `Mesurement ID : ${gaId.trim()} — Le script gtag.js est chargé sur toutes les pages.`
                  : 'Renseignez votre Measurement ID ci-dessous pour activer le suivi.'}
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Configuration</h3>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Measurement ID Google Analytics 4</label>
                  <input
                    className="form-input"
                    value={gaId}
                    onChange={e => setGaId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    style={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}
                  />
                  <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    Trouvez votre ID dans Google Analytics → Administration → Flux de données → votre flux web.
                    Laissez vide pour désactiver le suivi.
                  </p>
                </div>

                {error && (
                  <p style={{ color: 'var(--color-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
                )}
                {saved && (
                  <p style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '1rem' }}>✓ Sauvegardé — rechargez le site pour voir l'effet.</p>
                )}

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
              </form>
            )}
          </div>

          {/* Aide */}
          <div className="admin-card" style={{ marginTop: '1.5rem', background: 'var(--color-bg)' }}>
            <h3 style={{ fontSize: '0.9375rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Comment obtenir votre Measurement ID ?</h3>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              <li>Connectez-vous à <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>analytics.google.com</a></li>
              <li>Créez une propriété GA4 si vous n'en avez pas encore</li>
              <li>Allez dans <strong>Administration</strong> (engrenage en bas à gauche)</li>
              <li>Colonne "Propriété" → <strong>Flux de données</strong></li>
              <li>Cliquez sur votre flux web → copiez l'<strong>ID de mesure</strong> (G-XXXXXXXXXX)</li>
              <li>Collez-le dans le champ ci-dessus et cliquez <strong>Enregistrer</strong></li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
