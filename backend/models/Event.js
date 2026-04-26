const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['concert', 'flashmob', 'popup', 'exhibition', 'festival', 'protest', 'other'],
      required: true,
    },
    city: { type: String, required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    address: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    isLive: { type: Boolean, default: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String },
    expiresAt: { type: Date }, // auto-remove after X hours
  },
  { timestamps: true }
);

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Event', eventSchema);
