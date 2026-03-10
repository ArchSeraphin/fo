'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { adminCrudLimiter } = require('../middleware/rateLimiter');
const articleController = require('../controllers/articleController');
const { upload, uploadImage } = require('../controllers/uploadController');
const partnerController = require('../controllers/partnerController');
const settingsController = require('../controllers/settingsController');

router.use(requireAuth);

router.get('/articles', articleController.getAll);
router.post('/articles', adminCrudLimiter, articleController.create);
router.put('/articles/:id', adminCrudLimiter, articleController.update);
router.delete('/articles/:id', adminCrudLimiter, articleController.remove);
router.patch('/articles/:id/toggle', adminCrudLimiter, articleController.toggle);

// Upload image (multipart/form-data, champ "image")
router.post('/upload', adminCrudLimiter, upload.single('image'), uploadImage);

// Partenaires
router.get('/partners', partnerController.getAll);
router.post('/partners', adminCrudLimiter, partnerController.create);
router.put('/partners/:id', adminCrudLimiter, partnerController.update);
router.delete('/partners/:id', adminCrudLimiter, partnerController.remove);

// Paramètres (Analytics, etc.)
router.get('/settings', settingsController.getAll);
router.put('/settings', adminCrudLimiter, settingsController.update);

module.exports = router;
