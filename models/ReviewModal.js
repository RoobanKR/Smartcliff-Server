const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ratings: { type: Number, required: true },
  review: { type: String },
  type: { type: String, enum: ["institution","company"], },
  role: { type: String },
  company: { type: String, },
  institution: { type: String, },
  profile: {type: String,max: 3 * 1024 * 1024},
  video: {type: String,max: 10 * 1024 * 1024},
  createdBy: { type: String},
  createdOn: { type: Date, default: Date.now },
  lastModifiedBy: { type: String},
  lastModifiedOn: { type: Date, },
});

module.exports = mongoose.model('Review', reviewSchema);
