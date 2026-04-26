const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['historical', 'museum', 'mosque', 'castle', 'ruins', 'monument', 'cultural', 'other'],
      required: true,
    },
    city: { type: String, required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    address: { type: String },
    images: [{ type: String }],
    panoramas: [{ type: String }], // 360° equirectangular image URLs (Pannellum)
    period: { type: String }, // e.g. "Ottoman Era", "Byzantine"
    entryFee: { type: Number, default: 0 },
    openingHours: { type: String },
    website: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placeSchema.index({ location: '2dsphere' });
placeSchema.index({ city: 'text', name: 'text', description: 'text' });

module.exports = mongoose.model('Place', placeSchema);
