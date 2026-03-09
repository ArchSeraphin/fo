'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const articleController = require('../controllers/articleController');
const { upload, uploadImage } = require('../controllers/uploadController');
const partnerController = require('../controllers/partnerController');

router.use(requireAuth);

router.get('/articles', articleController.getAll);
router.post('/articles', articleController.create);
router.put('/articles/:id', articleController.update);
router.delete('/articles/:id', articleController.remove);
router.patch('/articles/:id/toggle', articleController.toggle);

// Upload image (multipart/form-data, champ "image")
router.post('/upload', upload.single('image'), uploadImage);

// Partenaires
router.get('/partners', partnerController.getAll);
router.post('/partners', partnerController.create);
router.put('/partners/:id', partnerController.update);
router.delete('/partners/:id', partnerController.remove);

module.exports = router;
