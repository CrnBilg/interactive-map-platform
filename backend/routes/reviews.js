const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewsController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/place/:placeId', optionalAuth, getReviews);
router.post('/place/:placeId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
