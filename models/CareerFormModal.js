const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  job_position: { type: String, required: true },
  qualification: { type: String, required: true },
  gender: { type: String, required: true },
  yearOfRelevantExperience: { type: String, required: true },
  resume: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  
  // New field to store email subjects and bodies
  responseEmails: [{
    from: { type: String, },
    to: { type: String, },
    name: { type: String, },
    subject: { type: String, },
    body: { type: String, },
    sentOn: { type: Date, default: Date.now },
    status: { type: String, },

  }]
});

module.exports = mongoose.model('career_form', careerSchema);