const Review = require('../models/Review');
const Place = require('../models/Place');

const canAccessPlace = (place, user) => {
  if (!place) return false;
  const addedById = place.addedBy?._id || place.addedBy;
  const isOwner = addedById?.toString() === user?._id?.toString();
  const isAdmin = user?.role === 'admin';
  const isLegacyAdminPlace = place.addedBy?.role === 'admin' && !place.visibility;
  const isPublic = place.visibility === 'public' || isLegacyAdminPlace || !place.addedBy;
  return isPublic || isOwner || isAdmin;
};

// @GET /api/reviews/place/:placeId
const getReviews = async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId).populate('addedBy', 'role');
    if (!canAccessPlace(place, req.user)) return res.status(404).json({ message: 'Place not found' });

    const reviews = await Review.find({ place: req.params.placeId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/reviews/place/:placeId
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);
    const trimmedComment = comment?.trim();

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!trimmedComment || trimmedComment.length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters' });
    }

    const place = await Place.findById(req.params.placeId);
    if (!canAccessPlace(place, req.user)) return res.status(404).json({ message: 'Place not found' });

    const existing = await Review.findOne({ place: req.params.placeId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this place' });

    const review = await Review.create({
      place: req.params.placeId,
      user: req.user._id,
      rating: numericRating,
      comment: trimmedComment,
    });

    // Update place rating
    const allReviews = await Review.find({ place: req.params.placeId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await Place.findByIdAndUpdate(req.params.placeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    await review.populate('user', 'username avatar');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await review.deleteOne();

    // Recalculate rating
    const allReviews = await Review.find({ place: review.place });
    const avgRating = allReviews.length
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;
    await Place.findByIdAndUpdate(review.place, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, createReview, deleteReview };
