import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/actualites', label: 'Actualités' },
    { to: '/partenaires', label: 'Partenaires' },
    { to: '/contact', label: 'Contact' },
  ];

  const showTransparent = isHome && !scrolled;

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} style={!showTransparent ? { background: 'white', boxShadow: '0 4px 16px rgba(38,54,90,0.12)' } : {}}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <img
              src={scrolled || !isHome ? '/img/logo/france-organes-logo-sombre.webp' : '/img/logo/france-organes-logo-blanc.webp'}
              alt="France Organes"
              className="logo-dark"
            />
          </Link>

          <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
            <span style={open ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
            <span style={open ? { opacity: 0 } : {}} />
            <span style={open ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
          </button>

          <div className={`navbar-nav${open ? ' open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${pathname === link.to ? ' active' : ''}`}
                style={(!scrolled && isHome) ? { color: 'white' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <div className="navbar-cta">
              <a href="https://www.helloasso.com" target="_blank" rel="noopener noreferrer" className={`btn btn-sm ${showTransparent ? 'btn-ghost' : 'btn-primary'}`}>
                Faire un don
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
