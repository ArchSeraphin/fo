'use strict';
const pool = require('../config/database');

// Clés autorisées en écriture (whitelist)
const ALLOWED_KEYS = ['ga_measurement_id'];

exports.getPublic = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT `key`, value FROM settings WHERE `key` IN (?)',
      [ALLOWED_KEYS]
    );
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT `key`, value FROM settings WHERE `key` IN (?)', [ALLOWED_KEYS]);
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.update = async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      const sanitized = typeof value === 'string' ? value.trim().slice(0, 200) : '';
      if (sanitized) {
        await pool.execute(
          'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
          [key, sanitized, sanitized]
        );
      } else {
        await pool.execute('DELETE FROM settings WHERE `key` = ?', [key]);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
