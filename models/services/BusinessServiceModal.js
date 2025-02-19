const mongoose = require('mongoose');

const bussinessServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true },
  createdBy: { type: String },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('business_service', bussinessServiceSchema);
