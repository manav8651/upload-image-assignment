const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware

router.post('/upload', protect, imageController.uploadImage);

module.exports = router;
