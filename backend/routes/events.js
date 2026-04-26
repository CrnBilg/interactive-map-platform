const express = require('express');
const router = express.Router();
const { getEvents, createEvent, likeEvent, deleteEvent } = require('../controllers/eventsController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getEvents);
router.post('/', protect, createEvent);
router.put('/:id/like', protect, likeEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
