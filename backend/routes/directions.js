const express = require('express');
const router = express.Router();
const { postDirections } = require('../controllers/directionsController');

router.post('/', postDirections);

module.exports = router;
