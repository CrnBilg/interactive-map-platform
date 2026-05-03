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
    panoramaUrl: { type: String },
    panoramaxImageId: { type: String },
    streetViewUrl: { type: String },
    has360: { type: Boolean, default: false },
    panoramas: [{ type: String }], // Legacy 360 equirectangular image URLs (Pannellum)
    panoramaItems: [
      {
        url: { type: String, required: true },
        mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
        title: { type: String },
        sourceUrl: { type: String },
        author: { type: String },
        license: { type: String },
        attribution: { type: String },
      },
    ],
    streetView: {
      panoId: { type: String },
      heading: { type: Number, default: 0 },
      pitch: { type: Number, default: 0 },
      fov: { type: Number, default: 80 },
      radius: { type: Number, default: 500 },
      maxDistance: { type: Number, default: 500 },
    },
    period: { type: String }, // e.g. "Ottoman Era", "Byzantine"
    entryFee: { type: Number, default: 0 },
    openingHours: { type: String },
    website: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

placeSchema.pre('validate', function setHas360(next) {
  this.has360 = Boolean(
    this.panoramaUrl ||
    this.panoramaxImageId ||
    this.streetViewUrl ||
    this.panoramas?.length ||
    this.panoramaItems?.some(item => item?.url)
  );
  next();
});

placeSchema.index({ location: '2dsphere' });
placeSchema.index({ city: 'text', name: 'text', description: 'text' });
placeSchema.index({ city: 1, category: 1, createdAt: -1 });
placeSchema.index({ addedBy: 1, visibility: 1, createdAt: -1 });

module.exports = mongoose.model('Place', placeSchema);
