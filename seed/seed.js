'use strict';
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const readline = require('readline');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Create tables
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      excerpt TEXT,
      content LONGTEXT NOT NULL,
      cover_image VARCHAR(500),
      published TINYINT(1) NOT NULL DEFAULT 0,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_published (published)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL DEFAULT 'Partenaire',
      website VARCHAR(500),
      logo_url VARCHAR(500),
      display_order INT NOT NULL DEFAULT 0,
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_active (active),
      INDEX idx_order (display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const email = process.argv[2] || await prompt('Email admin: ');
  const password = process.argv[3] || await prompt('Mot de passe admin: ');

  if (!email || !password || password.length < 8) {
    console.error('Email et mot de passe requis (min 8 caractères)');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const [existing] = await conn.execute('SELECT id FROM admins WHERE email = ?', [email]);
  if (existing.length > 0) {
    await conn.execute('UPDATE admins SET password_hash = ? WHERE email = ?', [hash, email]);
    console.log(`✓ Mot de passe mis à jour pour ${email}`);
  } else {
    await conn.execute('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, hash]);
    console.log(`✓ Compte admin créé : ${email}`);
  }

  await conn.end();
  console.log('✓ Tables créées/vérifiées');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
