'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

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

function logout(req, res) {
  res.clearCookie('access_token', COOKIE_OPTS);
  res.clearCookie('refresh_token', COOKIE_OPTS);
  res.json({ message: 'Déconnecté' });
}

module.exports = { login, refresh, logout };
