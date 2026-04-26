const Place = require('../models/Place');
const City = require('../models/City');

// @GET /api/places
const getPlaces = async (req, res) => {
  try {
    const { city, category, search, page = 1, limit = 20, lat, lng, radius = 10000 } = req.query;
    const query = {};

    if (city) query.city = { $regex: city, $options: 'i' };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    // Geo query
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const places = await Place.find(query)
      .populate('addedBy', 'username avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Place.countDocuments(query);

    res.json({ places, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/places/:id
const getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('addedBy', 'username avatar');
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/places
const createPlace = async (req, res) => {
  try {
    const { name, description, category, city, lat, lng, address, period, entryFee, openingHours, website, images, panoramas } = req.body;

    const place = await Place.create({
      name,
      description,
      category,
      city,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      address,
      period,
      entryFee,
      openingHours,
      website,
      images: images || [],
      panoramas: panoramas || [],
      addedBy: req.user._id,
    });

    // Update city place count
    await City.findOneAndUpdate({ name: { $regex: city, $options: 'i' } }, { $inc: { placeCount: 1 } });

    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/places/:id
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const isOwner = place.addedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const { lat, lng, ...rest } = req.body;
    Object.assign(place, rest);
    if (lat && lng) place.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };

    const updated = await place.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/places/:id
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const isOwner = place.addedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await place.deleteOne();
    res.json({ message: 'Place deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPlaces, getPlace, createPlace, updatePlace, deletePlace };
