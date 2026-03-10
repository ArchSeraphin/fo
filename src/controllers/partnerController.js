'use strict';
const xss = require('xss');
const pool = require('../config/database');

// Supprime tout HTML pour les champs texte simple
function stripHtml(str) {
  if (!str) return '';
  return xss(str, { whiteList: {}, stripIgnoreTag: true }).trim();
}

// Valide qu'une URL est https:// uniquement (ou chemin interne /uploads/ /img/)
function validateUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('/img/')) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'https:' || u.protocol === 'http:') return trimmed;
  } catch {}
  return null; // Rejeter javascript:, data:, vbscript:, etc.
}

async function getAll(req, res) {
  try {
    const onlyActive = !req.user;
    const where = onlyActive ? 'WHERE active = 1' : '';
    const [rows] = await pool.query(
      `SELECT * FROM partners ${where} ORDER BY display_order ASC, id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function create(req, res) {
  const { name, type, website, logo_url, display_order, active } = req.body;
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });

  const cleanName = stripHtml(name);
  const cleanType = stripHtml(type) || 'Partenaire';
  const cleanWebsite = validateUrl(website);
  const cleanLogoUrl = validateUrl(logo_url);
  const cleanOrder = parseInt(display_order) || 0;
  const isActive = active ? 1 : 0; // Correction du bug active ? 1 : 1

  if (!cleanName) return res.status(400).json({ error: 'Nom invalide' });
  if (website && cleanWebsite === null) return res.status(400).json({ error: 'URL du site invalide (doit commencer par http:// ou https://)' });
  if (logo_url && cleanLogoUrl === null) return res.status(400).json({ error: 'URL du logo invalide (doit commencer par http:// ou https://)' });

  try {
    const [result] = await pool.query(
      'INSERT INTO partners (name, type, website, logo_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?)',
      [cleanName, cleanType, cleanWebsite, cleanLogoUrl, cleanOrder, isActive]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function update(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID invalide' });

  const { name, type, website, logo_url, display_order, active } = req.body;

  const cleanWebsite = validateUrl(website);
  const cleanLogoUrl = validateUrl(logo_url);

  if (website && cleanWebsite === null) return res.status(400).json({ error: 'URL du site invalide (doit commencer par http:// ou https://)' });
  if (logo_url && cleanLogoUrl === null) return res.status(400).json({ error: 'URL du logo invalide (doit commencer par http:// ou https://)' });

  try {
    const [rows] = await pool.query('SELECT id FROM partners WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Partenaire introuvable' });

    await pool.query(
      'UPDATE partners SET name=?, type=?, website=?, logo_url=?, display_order=?, active=? WHERE id=?',
      [stripHtml(name), stripHtml(type) || 'Partenaire', cleanWebsite, cleanLogoUrl, parseInt(display_order) || 0, active ? 1 : 0, id]
    );
    res.json({ message: 'Partenaire mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const [result] = await pool.query('DELETE FROM partners WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
    res.json({ message: 'Partenaire supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getAll, create, update, remove };
