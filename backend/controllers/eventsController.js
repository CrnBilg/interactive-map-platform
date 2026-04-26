const Event = require('../models/Event');

// @GET /api/events
const getEvents = async (req, res) => {
  try {
    const { city, type, live, lat, lng, radius = 5000 } = req.query;
    const query = {};

    if (city) query.city = { $regex: city, $options: 'i' };
    if (type) query.type = type;
    if (live === 'true') query.isLive = true;

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    const events = await Event.find(query)
      .populate('reportedBy', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, description, type, city, cityId, lat, lng, address, startTime, endTime, image } = req.body;

    const expiresAt = endTime ? new Date(endTime) : new Date(Date.now() + 6 * 60 * 60 * 1000); // 6h default

    const event = await Event.create({
      title,
      description,
      type,
      city,
      cityId,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      address,
      startTime,
      endTime,
      image,
      expiresAt,
      reportedBy: req.user._id,
    });

    await event.populate('reportedBy', 'username avatar');

    // Emit to city room via socket
    const io = req.app.get('io');
    io.to(`city_${cityId || city}`).emit('event_added', event);

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/events/:id/like
const likeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const idx = event.likes.indexOf(req.user._id);
    if (idx > -1) {
      event.likes.splice(idx, 1);
    } else {
      event.likes.push(req.user._id);
    }
    await event.save();

    const io = req.app.get('io');
    io.to(`city_${event.cityId || event.city}`).emit('event_liked', {
      eventId: event._id,
      likes: event.likes.length,
    });

    res.json({ likes: event.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isOwner = event.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await event.deleteOne();

    const io = req.app.get('io');
    io.to(`city_${event.cityId || event.city}`).emit('event_removed', { eventId: event._id });

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, createEvent, likeEvent, deleteEvent };
