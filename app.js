'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ─── OG meta injection ────────────────────────────────────────────────────────
const BASE_URL = 'https://franceorganes.fr';
const SITE_NAME = 'France Organes';
const DEFAULT_OG_IMAGE = `${BASE_URL}/img/og-default.jpg`;

const STATIC_OG = {
  '/': {
    description: "Association nationale d'aide aux patients en attente de greffe d'organes.",
  },
  '/a-propos': {
    title: 'À propos',
    description: "Découvrez France Organes, association nationale d'aide aux patients en attente de greffe d'organes.",
    url: '/a-propos',
  },
  '/actualites': {
    title: 'Actualités',
    description: "Toutes les actualités de France Organes sur le don d'organes et la greffe.",
    url: '/actualites',
  },
  '/contact': {
    title: 'Contact',
    description: 'Contactez France Organes pour toute question ou demande d\'information.',
    url: '/contact',
  },
  '/partenaires': {
    title: 'Partenaires',
    description: 'Les partenaires de France Organes qui soutiennent notre mission.',
    url: '/partenaires',
  },
  '/mentions-legales': {
    title: 'Mentions légales',
    url: '/mentions-legales',
  },
};

function escapeAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildOgMeta({ title, description, url, image, type = 'website' }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Pour que la vie continue`;
  const ogImage = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : DEFAULT_OG_IMAGE;
  const ogUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  return [
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`,
    description ? `<meta property="og:description" content="${escapeAttr(description)}" />` : '',
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeAttr(ogUrl)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`,
    description ? `<meta name="twitter:description" content="${escapeAttr(description)}" />` : '',
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
  ].filter(Boolean).join('\n    ');
}

let indexHtmlCache = null;
function getIndexHtml() {
  if (!indexHtmlCache) {
    indexHtmlCache = fs.readFileSync(path.join(__dirname, 'client/dist/index.html'), 'utf8');
  }
  return indexHtmlCache;
}
// ─────────────────────────────────────────────────────────────────────────────

const pool = require('./src/config/database');

// Validation des variables d'environnement critiques au démarrage
const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: Variable d'environnement manquante : ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET doit faire au moins 32 caractères');
  process.exit(1);
}
if (process.env.JWT_REFRESH_SECRET.length < 32) {
  console.error('FATAL: JWT_REFRESH_SECRET doit faire au moins 32 caractères');
  process.exit(1);
}

const app = express();

// Trust proxy (Plesk/Nginx reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  frameguard: { action: 'deny' },
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use(express.static(path.join(__dirname, 'client/dist'), {
  maxAge: '1d',
  etag: true,
}));

// Images served from img/
app.use('/img', express.static(path.join(__dirname, 'img'), { maxAge: '7d' }));

// Uploaded images (randomly named WebP, served via Express only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));

// API routes
app.use('/api', require('./src/routes/api'));
app.use('/api/admin', require('./src/routes/admin'));

// Dynamic sitemap
app.get('/sitemap.xml', require('./src/routes/sitemap'));

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://franceorganes.fr/sitemap.xml\n');
});

// SPA fallback — injecte les meta OG côté serveur pour les crawlers sociaux
app.get('*', async (req, res) => {
  try {
    const html = getIndexHtml();
    const pathname = req.path;
    let ogData = STATIC_OG[pathname] || null;

    if (!ogData) {
      const articleMatch = pathname.match(/^\/actualites\/([^/]+)$/);
      if (articleMatch) {
        const [rows] = await pool.query(
          'SELECT title, excerpt, cover_image FROM articles WHERE slug = ? AND published = 1 LIMIT 1',
          [articleMatch[1]]
        );
        if (rows[0]) {
          ogData = {
            title: rows[0].title,
            description: rows[0].excerpt || undefined,
            image: rows[0].cover_image || undefined,
            url: pathname,
            type: 'article',
          };
        }
      }
    }

    const injected = ogData ? buildOgMeta(ogData) : '';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html.replace('<!-- OG_META -->', injected));
  } catch (err) {
    console.error('SPA OG injection error:', err);
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  }
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message;
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`France Organes server running on port ${PORT}`);
});

module.exports = app;
