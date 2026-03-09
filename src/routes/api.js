'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { loginLimiter, contactLimiter, apiLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const partnerController = require('../controllers/partnerController');

router.use(apiLimiter);

// Articles publics
router.get('/articles', articleController.getAll);
router.get('/articles/:slug', articleController.getOne);

// Partenaires publics
router.get('/partners', partnerController.getAll);

// Contact
router.post('/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().notEmpty().isLength({ max: 2000 }),
  ],
  (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
  contactController.sendContact
);

// Auth
router.post('/auth/login', loginLimiter, authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

module.exports = router;
