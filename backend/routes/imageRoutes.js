const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
// const { protect } = require('../middleware/authMiddleware'); // Assuming you have authentication middleware

router.post('/upload', imageController.uploadImage);

module.exports = router;
