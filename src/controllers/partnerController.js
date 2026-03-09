'use strict';
const pool = require('../config/database');

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
  try {
    const [result] = await pool.query(
      'INSERT INTO partners (name, type, website, logo_url, display_order, active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type || 'Partenaire', website || null, logo_url || null, display_order ?? 0, active ? 1 : 1]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, type, website, logo_url, display_order, active } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM partners WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Partenaire introuvable' });
    await pool.query(
      'UPDATE partners SET name=?, type=?, website=?, logo_url=?, display_order=?, active=? WHERE id=?',
      [name, type || 'Partenaire', website || null, logo_url || null, display_order ?? 0, active ? 1 : 0, id]
    );
    res.json({ message: 'Partenaire mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function remove(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM partners WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
    res.json({ message: 'Partenaire supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getAll, create, update, remove };
