'use strict';
const pool = require('../config/database');

const BASE_URL = 'https://franceorganes.fr';

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/a-propos', priority: '0.8', changefreq: 'monthly' },
  { loc: '/actualites', priority: '0.9', changefreq: 'weekly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/partenaires', priority: '0.6', changefreq: 'monthly' },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async function sitemap(req, res) {
  try {
    const [articles] = await pool.execute(
      'SELECT slug, updated_at, published_at FROM articles WHERE published = 1 ORDER BY published_at DESC'
    );

    const today = new Date().toISOString().split('T')[0];
    const urls = [
      ...STATIC_PAGES.map(p => `
  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
      ...articles.map(a => {
        const lastmod = (a.updated_at || a.published_at || '').toISOString
          ? (a.updated_at || a.published_at).toISOString().split('T')[0]
          : String(a.updated_at || a.published_at || '').split('T')[0];
        return `
  <url>
    <loc>${BASE_URL}/actualites/${escapeXml(a.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<!-- sitemap error -->');
  }
};
