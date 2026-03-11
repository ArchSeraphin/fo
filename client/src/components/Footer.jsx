import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/img/logo/france-organes-logo-blanc.webp" alt="France Organes" />
            <p>France Organes accompagne les patients en attente de greffe et sensibilise le grand public au don d'organes, <em>pour que la vie continue</em>.</p>
          </div>

          <div>
            <p className="footer-title">Navigation</p>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/actualites">Actualités</Link></li>
              <li><Link to="/partenaires">Partenaires</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/*<div>
            <p className="footer-title">Contact</p>
            <ul className="footer-links">
              <li>contact@franceorganes.fr</li>
              <li>France Organes</li>
              <li style={{ marginTop: '1rem' }}>
                <Link to="/mentions-legales">Mentions légales</Link>
              </li>
            </ul>
          </div>
        </div>*/}

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} France Organes — Association loi 1901</span>
          <Link to="/mentions-legales" style={{ color: 'rgba(255,255,255,0.4)' }}>Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
