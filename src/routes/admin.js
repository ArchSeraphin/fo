'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const articleController = require('../controllers/articleController');
const { upload, uploadImage } = require('../controllers/uploadController');

router.use(requireAuth);

router.get('/articles', articleController.getAll);
router.post('/articles', articleController.create);
router.put('/articles/:id', articleController.update);
router.delete('/articles/:id', articleController.remove);
router.patch('/articles/:id/toggle', articleController.toggle);

// Upload image (multipart/form-data, champ "image")
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
