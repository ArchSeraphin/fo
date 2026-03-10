'use strict';
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputDir = path.join(__dirname, '../img/photos');
const outputDir = path.join(__dirname, '../img/photos/webp');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png)$/i.test(f));

Promise.all(files.map(f => {
  const name = path.basename(f, path.extname(f)).toLowerCase();
  return sharp(path.join(inputDir, f))
    .rotate() // respecte l'orientation EXIF
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(outputDir, name + '.webp'))
    .then(info => console.log(name + '.webp', info.width + 'x' + info.height, Math.round(info.size / 1024) + 'kb'));
})).then(() => console.log('Conversion terminée : ' + files.length + ' fichiers'));
