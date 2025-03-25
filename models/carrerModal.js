const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subTitle: { type: String, required: true },
  subDescription: { type: String, required: true },
  image: { type: String, required: true },

  createdBy: { type: String },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('career', careerSchema);
