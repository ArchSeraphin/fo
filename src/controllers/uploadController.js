'use strict';
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const multer = require('multer');

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 82;

const uploadsDir = path.join(__dirname, '../../uploads');

// Multer : stockage en mémoire, validation MIME et taille
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(Object.assign(new Error('Format non autorisé. Utilisez JPG, PNG, GIF ou WebP.'), { status: 415 }));
    }
  },
});

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${uuidv4()}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    await sharp(req.file.buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "Erreur lors du traitement de l'image" });
  }
}

module.exports = { upload, uploadImage };
