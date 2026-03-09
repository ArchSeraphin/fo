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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>

            <div className="reveal-left">
              <h3 style={{ marginBottom: '1.5rem' }}>Nos coordonnées</h3>
              {[
                { icon: '✉️', label: 'Email', value: 'contact@franceorganes.fr' },
                { icon: '📍', label: 'Adresse', value: 'France' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--color-primary)', margin: '0 0 0.25rem' }}>{c.label}</p>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-card reveal-right" style={{ borderRadius: 'var(--radius-xl)', padding: '2.5rem', background: 'white', boxShadow: 'var(--shadow-md)' }}>
              {status && (
                <div className={status.type === 'success' ? 'form-success' : 'form-error'} style={status.type === 'error' ? { background: '#ffebee', border: '1px solid #ef5350', color: '#c62828', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' } : {}}>
                  {status.message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} required maxLength={100} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} maxLength={20} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet</label>
                    <input className="form-input" name="subject" value={form.subject} onChange={handleChange} maxLength={200} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} required maxLength={2000} />
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
