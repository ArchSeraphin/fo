import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok) {
        setStatus({ type: 'success', message: 'Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.' });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Une erreur est survenue.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Impossible d\'envoyer le message. Vérifiez votre connexion.' });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <ScrollReveal />

      <div className="page-header">
        <div className="container">
          <h1>Nous contacter</h1>
          <p>Une question, un témoignage, envie de nous rejoindre ? Écrivez-nous.</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>

            {/* Colonne info */}
            <div className="reveal-left" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Carte contact */}
              <div style={{
                background: 'linear-gradient(145deg, var(--color-primary-dark), var(--color-primary))',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                color: 'white',
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.65, marginBottom: '1.25rem' }}>Coordonnées</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '2px' }}>✉️</span>
                    <div>
                      <p style={{ fontSize: '0.75rem', opacity: 0.65, margin: '0 0 0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</p>
                      <a
                        href="mailto:contact@franceorganes.fr"
                        style={{ color: 'white', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '1px', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.target.style.borderColor = 'white'}
                        onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                      >
                        contact@franceorganes.fr
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '2px' }}>📍</span>
                    <div>
                      <p style={{ fontSize: '0.75rem', opacity: 0.65, margin: '0 0 0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Présence</p>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>Nationale — France</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte délai de réponse */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                borderLeft: '4px solid var(--color-secondary)',
              }}>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.5rem', fontSize: '0.9375rem' }}>Délai de réponse</p>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Nous répondons généralement sous <strong>48h</strong>. Pour toute urgence, précisez-le dans le sujet.
                </p>
              </div>

              {/* Carte bénévolat */}
              <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.5rem', fontSize: '0.9375rem' }}>Devenir bénévole ?</p>
                <p style={{ color: 'var(--color-text-muted)', margin: '0 0 1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Rejoignez nos 40+ bénévoles engagés partout en France.
                </p>
                <a href="mailto:contact@franceorganes.fr?subject=Je souhaite devenir bénévole" className="btn btn-outline btn-sm" style={{ fontSize: '0.8125rem' }}>
                  Nous rejoindre →
                </a>
              </div>
            </div>

            {/* Formulaire */}
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-xl)', padding: '2.5rem', background: 'white', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Envoyez-nous un message</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
                Une question, un témoignage ou une proposition de partenariat ? Nous lisons tous les messages.
              </p>

              {status && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9375rem',
                  ...(status.type === 'success'
                    ? { background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#1b5e20' }
                    : { background: '#ffebee', border: '1px solid #ef5350', color: '#c62828' })
                }}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} required maxLength={100} placeholder="Marie Dupont" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="marie@exemple.fr" />
                  </div>
                </div>
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} maxLength={20} placeholder="06 00 00 00 00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet</label>
                    <input className="form-input" name="subject" value={form.subject} onChange={handleChange} maxLength={200} placeholder="Bénévolat, partenariat..." />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} required maxLength={2000} placeholder="Votre message..." style={{ minHeight: '140px' }} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
