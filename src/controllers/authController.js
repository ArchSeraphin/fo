'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

// Hash SHA-256 du token avant stockage en DB (si la DB est compromise, les tokens bruts ne sont pas exposés)
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Stocker le hash du refresh token en DB pour permettre la révocation
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    // Nettoyer les tokens expirés de cet admin (maintenance en arrière-plan)
    pool.query('DELETE FROM refresh_tokens WHERE admin_id = ? AND expires_at < NOW()', [user.id])
      .catch(err => console.error('Token cleanup error:', err));

    res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Connecté', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function refresh(req, res) {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ error: 'Refresh token manquant' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Vérifier que le type est bien 'refresh' (évite la confusion access/refresh token)
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Vérifier que le token est bien dans la DB (pas révoqué)
    const tokenHash = hashToken(token);
    const [tokenRows] = await pool.query(
      'SELECT id FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
      [tokenHash]
    );
    if (!tokenRows[0]) return res.status(401).json({ error: 'Session expirée ou révoquée' });

    const [rows] = await pool.query('SELECT id, email FROM admins WHERE id = ? LIMIT 1', [payload.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.json({ message: 'Token rafraîchi' });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token invalide' });
  }
}

async function logout(req, res) {
  const token = req.cookies.refresh_token;

  // Révoquer le refresh token en DB
  if (token) {
    try {
      const tokenHash = hashToken(token);
      await pool.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
    } catch (err) {
      console.error('Logout token revocation error:', err);
    }
  }

  res.clearCookie('access_token', COOKIE_OPTS);
  res.clearCookie('refresh_token', COOKIE_OPTS);
  res.json({ message: 'Déconnecté' });
}

module.exports = { login, refresh, logout };
