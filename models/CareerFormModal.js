const mongoose = require('mongoose');

const careetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  job_position: { type: String, required: true },
  qualification: { type: String, required: true },
  gender: { type: String, required: true },
  yearOfRelevantExperience: { type: String, required: true },

  resume: { type: String, required: true },

  createdBy: { type: String },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('career_form', careetSchema);
