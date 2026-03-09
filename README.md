# France Organes — Site vitrine

Site vitrine + dashboard admin pour l'association France Organes.

## Stack technique

- **Backend** : Node.js + Express.js
- **Frontend** : React 18 + Vite
- **Base de données** : MySQL 8+
- **Hébergement** : Plesk (Linux) avec Passenger

## Structure du projet

```
fo/
├── app.js                  # Point d'entrée Passenger/Node.js
├── src/
│   ├── config/             # Configuration DB
│   ├── controllers/        # Logique métier
│   ├── middleware/         # Auth, rate limit
│   └── routes/             # Routes API
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/          # Pages publiques + admin
│   │   ├── components/     # Composants réutilisables
│   │   └── styles/         # CSS global
│   └── dist/               # Build React (généré)
├── seed/                   # Script de création DB + admin
├── img/                    # Assets images
└── uploads/                # Médias uploadés (hors dépôt)
```

## Installation sur Plesk

### 1. Cloner le dépôt

Dans Plesk > Git, connecter le repository GitHub :
- Repository URL: `https://github.com/ArchSeraphin/fo`
- Branch: `main`
- Deploy path: `/var/www/vhosts/fo2.voilavoila.tv/httpdocs`

Configurer l'action de déploiement additionnelle :
```bash
npm install && npm run build
```

### 2. Configurer l'application Node.js

Dans Plesk > Node.js :
- Node.js version : 18+ LTS
- Document root : `/var/www/vhosts/fo2.voilavoila.tv/httpdocs`
- Application root : `/var/www/vhosts/fo2.voilavoila.tv/httpdocs`
- Application startup file : `app.js`
- Cliquer "Enable Node.js"

### 3. Variables d'environnement

Copier `.env.example` en `.env` dans le panneau Plesk > Node.js > Environment variables, ou via fichier :

```bash
cp .env.example .env
# Éditer .env avec les vraies valeurs
```

Variables obligatoires à remplir :
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — Credentials MySQL Plesk
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — Chaînes aléatoires longues (min 32 chars)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` — Config email
- `ALLOWED_ORIGIN` — URL du site (ex: `https://fo2.voilavoila.tv`)
- `NODE_ENV` — `production`

### 4. Base de données MySQL

Dans Plesk > Bases de données :
1. Créer une base de données (ex: `france_organes`)
2. Créer un utilisateur avec tous les droits sur cette base

### 5. Premier démarrage — Créer le compte admin

```bash
node seed/seed.js admin@example.com MotDePasseSecurisé!
```

Le script crée les tables et le compte administrateur.

### 6. Démarrer l'application

Dans Plesk > Node.js, cliquer "Restart App".

## Workflow GitHub → Plesk (déploiement auto)

1. Développer et tester localement (si besoin)
2. `git add . && git commit -m "feat: description"`
3. `git push origin main`
4. Plesk reçoit le webhook → pull + `npm install && npm run build` → restart

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarrer le serveur (production) |
| `npm run dev` | Démarrer avec nodemon (dev) |
| `npm run build` | Builder le frontend React |
| `npm run seed` | Créer/mettre à jour le compte admin |
| `node seed/seed.js email password` | Seed avec arguments directs |

## Sécurité

- JWT access token : 15 min (httpOnly cookie)
- JWT refresh token : 7 jours (httpOnly cookie)
- Rate limiting : login 5/15min, contact 3/h, API 100/15min
- Helmet.js : CSP, HSTS, X-Frame-Options, etc.
- Bcrypt 12 rounds pour les mots de passe
- `.htaccess` : blocage node_modules, .env, .git, etc.

## URLs

| Environnement | URL |
|---------------|-----|
| Développement | https://fo2.voilavoila.tv |
| Production | https://franceorganes.fr |
| Admin | /admin/connexion |
