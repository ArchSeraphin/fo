# France Organes — Site vitrine

Site vitrine + dashboard admin pour l'association France Organes.
**Production :** https://franceorganes.fr | **Staging :** https://fo2.voilavoila.tv

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| Backend | Node.js 18+ / Express.js 4 |
| Frontend | React 18 + Vite 5 |
| Base de données | MySQL 8+ |
| Hébergement | Plesk (Linux) + Passenger |
| Auth | JWT 15min access + 7j refresh (httpOnly cookies) |
| Upload images | Multer + Sharp (WebP auto) |
| Email | Nodemailer (SMTP) |
| SEO | react-helmet-async, Schema.org JSON-LD, sitemap dynamique |

---

## Structure du projet

```
fo/
├── app.js                      # Point d'entrée Passenger/Node.js
├── src/
│   ├── config/
│   │   └── database.js         # Pool MySQL (mysql2/promise)
│   ├── controllers/
│   │   ├── articleController.js  # CRUD articles + XSS sanitization
│   │   ├── authController.js     # Login/refresh/logout + DB refresh tokens
│   │   ├── contactController.js  # Envoi email via Nodemailer
│   │   ├── mediaController.js    # Upload images → Sharp WebP
│   │   └── partnerController.js  # CRUD partenaires
│   ├── middleware/
│   │   ├── auth.js             # requireAuth (vérif JWT access token)
│   │   └── rateLimiter.js      # login 5/15min, contact 3/h, API 100/15min, admin 60/min
│   └── routes/
│       ├── api.js              # Routes publiques (/api/*)
│       ├── admin.js            # Routes protégées (/api/admin/*)
│       └── sitemap.js          # Génération /sitemap.xml depuis DB
├── client/                     # Frontend React (Vite)
│   ├── src/
│   │   ├── App.jsx             # Router, Auth context, HelmetProvider, Schema.org NGO
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ScrollReveal.jsx
│   │   │   └── SEO.jsx         # Composant SEO réutilisable (meta, OG, Twitter)
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Hero, stats, missions, actualités, CTA
│   │   │   ├── About.jsx       # Histoire, équipe, valeurs, galerie photos lightbox
│   │   │   ├── News.jsx        # Liste articles paginée (URL ?page=N)
│   │   │   ├── NewsDetail.jsx  # Article + Schema.org NewsArticle + Breadcrumb
│   │   │   ├── Contact.jsx     # Formulaire de contact
│   │   │   ├── Partners.jsx    # Grille partenaires
│   │   │   ├── Legal.jsx       # Mentions légales
│   │   │   ├── NotFound.jsx    # Page 404
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ArticleEditor.jsx  # Éditeur Quill WYSIWYG + upload image
│   │   │       ├── PartnersDashboard.jsx
│   │   │       └── PartnerEditor.jsx
│   │   └── styles/
│   │       └── main.css        # Design system complet (variables CSS, composants)
│   ├── index.html
│   └── package.json
├── seed/
│   └── seed.js                 # Création tables DB + compte admin initial
├── scripts/
│   └── convert-photos.js       # Conversion batch JPG → WebP (Sharp)
├── img/                        # Assets statiques
│   ├── logo/
│   ├── photos/webp/            # 16 photos converties en WebP
│   └── *.png / *.jpg
├── uploads/                    # Médias uploadés (ignoré par git)
├── .env.example
└── .htaccess                   # Sécurité Plesk (bloque .env, node_modules, etc.)
```

---

## Tables MySQL

```sql
-- Administrateurs
admins (id, email, password_hash, created_at)

-- Articles
articles (id, title, slug, excerpt, content, cover_image,
          published, published_at, created_at, updated_at)

-- Refresh tokens (révocation sécurisée)
refresh_tokens (id, admin_id, token_hash VARCHAR(64) UNIQUE,
                expires_at, created_at)
-- INDEX idx_token_hash, FK → admins ON DELETE CASCADE
```

---

## Pages et routes

### Frontend (React Router)

| Route | Page | SEO |
|-------|------|-----|
| `/` | Home | canonical, OG, description |
| `/a-propos` | À propos | canonical, OG, description |
| `/actualites` | Actualités | canonical, pagination `?page=N` |
| `/actualites/:slug` | Article | NewsArticle schema, BreadcrumbList, OG article |
| `/contact` | Contact | canonical, OG |
| `/partenaires` | Partenaires | canonical, OG |
| `/mentions-legales` | Mentions légales | noindex |
| `/admin/*` | Dashboard admin | protégé par JWT |
| `*` | NotFound 404 | noindex |

### API Backend (Express)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/articles?page=N&limit=N` | Liste articles publiés |
| GET | `/api/articles/:slug` | Détail article |
| GET | `/api/partners` | Liste partenaires |
| POST | `/api/contact` | Envoi email contact |
| POST | `/api/auth/login` | Connexion admin |
| POST | `/api/auth/refresh` | Renouvellement access token |
| POST | `/api/auth/logout` | Déconnexion + révocation refresh token |
| GET | `/sitemap.xml` | Sitemap dynamique (pages + articles DB) |
| GET | `/robots.txt` | Robots (bloque /admin/) |
| POST | `/api/admin/articles` | Créer article |
| PUT | `/api/admin/articles/:id` | Modifier article |
| DELETE | `/api/admin/articles/:id` | Supprimer article |
| PATCH | `/api/admin/articles/:id/publish` | Publier/dépublier |
| POST | `/api/admin/partners` | Créer partenaire |
| PUT | `/api/admin/partners/:id` | Modifier partenaire |
| DELETE | `/api/admin/partners/:id` | Supprimer partenaire |
| POST | `/api/admin/media/upload` | Upload image → WebP |

---

## Sécurité implémentée

- **JWT** : access token 15min + refresh token 7j (httpOnly, sameSite: strict)
- **Révocation** : refresh tokens stockés hashés (SHA-256) en DB, supprimés au logout
- **Rate limiting** : login 5/15min, contact 3/h, API 100/15min, admin CRUD 60/min
- **Helmet.js** : CSP, HSTS (prod), X-Frame-Options deny, etc.
- **Bcrypt** : 12 rounds sur les mots de passe
- **XSS** : package `xss` sur le contenu Quill (whitelist HTML stricte), `stripHtml()` sur les champs texte
- **Validation** : `express-validator` sur toutes les routes publiques
- **URL validation** : seuls `/uploads/`, `/img/`, `https://` acceptés (bloque `javascript:`, `data:`)
- **ID validation** : regex `/^\d+$/` sur tous les paramètres ID
- **Startup check** : `process.exit(1)` si variables d'environnement critiques manquantes ou trop courtes
- **CSRF** : mitigé par `sameSite: strict` (pas de middleware CSRF nécessaire)
- **`.htaccess`** : bloque `.env`, `node_modules`, `.git`, fichiers sensibles

---

## SEO implémenté

- `react-helmet-async` : title, description, canonical, Open Graph, Twitter Card dynamiques par page
- Schema.org **NGO** (Organization) global dans `App.jsx`
- Schema.org **NewsArticle** + **BreadcrumbList** sur chaque article
- **Sitemap dynamique** `/sitemap.xml` : pages statiques + tous les articles publiés depuis DB
- **robots.txt** : `Disallow: /admin/`, pointeur vers sitemap
- Pagination **indexable** : `?page=N` dans l'URL
- `lang="fr"` sur `<html>`
- Page 404 propre (NotFound) au lieu d'une redirection silencieuse

---

## Design system

| Variable | Valeur |
|----------|--------|
| `--color-primary` | `#26365a` (bleu marine) |
| `--color-secondary` | `#ce232b` (rouge) |
| `--color-accent` | `#f0a500` (or) |
| `--color-bg` | `#f7f4f0` (crème) |
| `--font-display` | Fraunces (variable, Google Fonts) |
| `--font-body` | Source Sans 3 (Google Fonts) |

Composants CSS : `.card`, `.btn`, `.section`, `.hero`, `.page-header`, `.stats-bar`, `.photo-gallery`, `.lightbox`, `.form-input`, `.partner-item`, etc.

---

## Installation sur Plesk

### 1. Cloner le dépôt

Dans Plesk > Git :
- Repository URL : `https://github.com/ArchSeraphin/fo`
- Branch : `main`
- Action de déploiement : `npm install && npm run build`

### 2. Configurer Node.js

Dans Plesk > Node.js :
- Version : 18+ LTS
- Startup file : `app.js`
- Cliquer "Enable Node.js"

### 3. Variables d'environnement

```bash
# Base de données
DB_HOST=localhost
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=france_organes
DB_PORT=3306

# JWT (minimum 32 caractères chacun)
JWT_SECRET=votre_secret_tres_long_minimum_32_chars
JWT_REFRESH_SECRET=autre_secret_tres_long_minimum_32_chars

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=email@example.com
SMTP_PASS=mot_de_passe_smtp
CONTACT_EMAIL=contact@franceorganes.fr

# App
ALLOWED_ORIGIN=https://franceorganes.fr
NODE_ENV=production
PORT=3000
```

### 4. Base de données + compte admin

```bash
# Crée les tables ET le premier compte admin
node seed/seed.js admin@franceorganes.fr MotDePasseSecurisé!
```

### 5. Démarrer

Dans Plesk > Node.js → "Restart App".

---

## Déploiement continu

```
git push origin main
  → Webhook Plesk
  → git pull
  → npm install && npm run build
  → Restart Passenger automatique
```

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarrer le serveur (production) |
| `npm run dev` | Démarrer avec nodemon |
| `npm run build` | Builder le frontend React |
| `node seed/seed.js email password` | Créer/recréer le compte admin |
| `node scripts/convert-photos.js` | Convertir les photos en WebP |
