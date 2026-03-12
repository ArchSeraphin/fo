'use strict';
const nodemailer = require('nodemailer');

// Singleton : un seul transporter réutilisé pour toutes les requêtes
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });
  }
  return transporter;
}

function closeTransporter() {
  if (transporter) {
    transporter.close();
    transporter = null;
  }
}

async function sendContact(req, res) {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message requis' });
  }

  try {
    await getTransporter().sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[France Organes] ${subject || 'Nouveau message de contact'}`,
      text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || 'Non renseigné'}\n\n${message}`,
      html: `<p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p><hr><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
}

module.exports = { sendContact, closeTransporter };
