'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const articleController = require('../controllers/articleController');

router.use(requireAuth);

router.get('/articles', articleController.getAll);
router.post('/articles', articleController.create);
router.put('/articles/:id', articleController.update);
router.delete('/articles/:id', articleController.remove);
router.patch('/articles/:id/toggle', articleController.toggle);

module.exports = router;
