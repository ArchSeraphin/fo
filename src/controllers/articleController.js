'use strict';
const xss = require('xss');
const pool = require('../config/database');

// Tags autorisés pour le contenu Quill (éditeur riche)
const contentXssOptions = {
  whiteList: {
    h2: ['class'], h3: ['class'],
    p: ['class'], br: [],
    strong: [], em: [], u: [], s: [],
    ul: ['class'], ol: ['class'], li: [],
    blockquote: [],
    a: ['href', 'target', 'rel'],
    span: ['class'],
  },
  onTagAttr: (tag, name, value) => {
    // Bloquer les protocoles dangereux dans href
    if (tag === 'a' && name === 'href') {
      const lower = value.toLowerCase().trim();
      if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
        return 'href="#"';
      }
    }
    // Forcer rel="noopener noreferrer" sur les liens externes
    if (tag === 'a' && name === 'rel') {
      return 'rel="noopener noreferrer"';
    }
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
};

// Supprime tout HTML pour les champs texte simple
function stripHtml(str) {
  if (!str) return '';
  return xss(str, { whiteList: {}, stripIgnoreTag: true }).trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function getAll(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;
  const onlyPublished = !req.user;

  try {
    const whereClause = onlyPublished ? 'WHERE published = 1' : '';
    const [rows] = await pool.query(
      `SELECT id, title, slug, excerpt, cover_image, published, published_at, created_at FROM articles ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM articles ${whereClause}`);

    res.json({ articles: rows, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getOne(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE slug = ? LIMIT 1',
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });
    if (!rows[0].published && !req.user) return res.status(404).json({ error: 'Article introuvable' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function create(req, res) {
  const { title, excerpt, content, cover_image, published } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Titre et contenu requis' });

  const cleanTitle = stripHtml(title);
  const cleanExcerpt = excerpt ? stripHtml(excerpt) : null;
  const cleanContent = xss(content, contentXssOptions);
  const cleanCoverImage = validateImageUrl(cover_image);

  if (!cleanTitle) return res.status(400).json({ error: 'Titre invalide' });

  let slug = slugify(cleanTitle);
  const [existing] = await pool.query('SELECT id FROM articles WHERE slug = ?', [slug]);
  if (existing.length) slug = `${slug}-${Date.now()}`;

  try {
    const [result] = await pool.query(
      'INSERT INTO articles (title, slug, excerpt, content, cover_image, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cleanTitle, slug, cleanExcerpt, cleanContent, cleanCoverImage, published ? 1 : 0, published ? new Date() : null]
    );
    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function update(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID invalide' });

  const { title, excerpt, content, cover_image, published } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });

    const cleanTitle = title ? stripHtml(title) : rows[0].title;
    const cleanExcerpt = excerpt !== undefined ? (excerpt ? stripHtml(excerpt) : null) : rows[0].excerpt;
    const cleanContent = content ? xss(content, contentXssOptions) : rows[0].content;
    const cleanCoverImage = cover_image !== undefined ? validateImageUrl(cover_image) : rows[0].cover_image;

    const wasPublished = rows[0].published;
    const publishedAt = published && !wasPublished ? new Date() : rows[0].published_at;

    await pool.query(
      'UPDATE articles SET title=?, excerpt=?, content=?, cover_image=?, published=?, published_at=?, updated_at=NOW() WHERE id=?',
      [cleanTitle, cleanExcerpt, cleanContent, cleanCoverImage, published ? 1 : 0, publishedAt, id]
    );
    res.json({ message: 'Article mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Article introuvable' });
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function toggle(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const [rows] = await pool.query('SELECT id, published FROM articles WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });
    const newStatus = rows[0].published ? 0 : 1;
    await pool.query(
      'UPDATE articles SET published=?, published_at=?, updated_at=NOW() WHERE id=?',
      [newStatus, newStatus ? new Date() : null, id]
    );
    res.json({ published: !!newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Valide qu'une URL d'image est https:// ou /uploads/ ou /img/
function validateImageUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Chemins internes (uploads ou img)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('/img/')) return trimmed;
  // URLs externes : doit être https
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'https:') return trimmed;
  } catch {}
  return null;
}

module.exports = { getAll, getOne, create, update, remove, toggle };
