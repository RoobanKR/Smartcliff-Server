const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ratings: { type: Number, required: true },
  review: { type: String, required: true },
  role: { type: String, required: true },
  batch: { type: String, required: true },
  profile: {type: String,max: 3 * 1024 * 1024},
  video: {type: String,max: 10 * 1024 * 1024},
  createdBy: { type: String},
  createdOn: { type: Date, default: Date.now },
  lastModifiedBy: { type: String},
  lastModifiedOn: { type: Date, },
});

module.exports = mongoose.model('Review', reviewSchema);
