const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewsController');
const { protect } = require('../middleware/auth');

router.get('/place/:placeId', getReviews);
router.post('/place/:placeId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
