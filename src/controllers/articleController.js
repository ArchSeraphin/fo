'use strict';
const pool = require('../config/database');

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

  let slug = slugify(title);
  const [existing] = await pool.query('SELECT id FROM articles WHERE slug = ?', [slug]);
  if (existing.length) slug = `${slug}-${Date.now()}`;

  try {
    const [result] = await pool.query(
      'INSERT INTO articles (title, slug, excerpt, content, cover_image, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt || null, content, cover_image || null, published ? 1 : 0, published ? new Date() : null]
    );
    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { title, excerpt, content, cover_image, published } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });

    const wasPublished = rows[0].published;
    const publishedAt = published && !wasPublished ? new Date() : rows[0].published_at;

    await pool.query(
      'UPDATE articles SET title=?, excerpt=?, content=?, cover_image=?, published=?, published_at=?, updated_at=NOW() WHERE id=?',
      [title || rows[0].title, excerpt ?? rows[0].excerpt, content || rows[0].content, cover_image ?? rows[0].cover_image, published ? 1 : 0, publishedAt, id]
    );
    res.json({ message: 'Article mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function remove(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Article introuvable' });
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function toggle(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, published FROM articles WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Article introuvable' });
    const newStatus = rows[0].published ? 0 : 1;
    await pool.query(
      'UPDATE articles SET published=?, published_at=?, updated_at=NOW() WHERE id=?',
      [newStatus, newStatus ? new Date() : null, req.params.id]
    );
    res.json({ published: !!newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getAll, getOne, create, update, remove, toggle };
