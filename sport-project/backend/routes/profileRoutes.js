const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { saveProfile, getProfile, getProfileById, searchPlayers, addReview, deleteReview } = require('../controllers/profileController');
const verifyToken = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.post('/', verifyToken, upload.single('photo'), saveProfile);
router.get('/', verifyToken, getProfile);
router.get('/search', verifyToken, searchPlayers);
router.get('/:id', verifyToken, getProfileById);
router.post('/:id/review', verifyToken, addReview);
router.delete('/:id/review/:reviewId', verifyToken, deleteReview);

module.exports = router;
