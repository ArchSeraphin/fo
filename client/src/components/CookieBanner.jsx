import React from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner({ onAccept, onRefuse }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'white',
      borderTop: '1px solid var(--color-border)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      padding: '1.25rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <p style={{
          margin: 0,
          flex: 1,
          fontSize: '0.9375rem',
          color: 'var(--color-text)',
          minWidth: '260px',
          lineHeight: 1.6,
        }}>
          Ce site utilise <strong>Google Analytics</strong> pour mesurer son audience de façon anonyme.
          Les données ne sont jamais transmises à des tiers.{' '}
          <Link to="/mentions-legales" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
            En savoir plus
          </Link>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button
            onClick={onRefuse}
            style={{
              padding: '0.5625rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              background: 'white',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
          >
            Refuser
          </button>
          <button
            onClick={onAccept}
            style={{
              padding: '0.5625rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
