const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    nameEn: { type: String },
    region: { type: String },
    country: { type: String, default: 'Turkey' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    image: { type: String },
    description: { type: String },
    placeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

citySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('City', citySchema);
