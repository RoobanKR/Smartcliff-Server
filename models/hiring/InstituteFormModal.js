const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema({
  service: { type: String, required: true },
  resources: { type: String, required: true },
});

const instituteFormSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  institute_name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  services: { type: [serviceSchema] },  // Array of services

  enquiry: { type: String, required: true},
  createdAt: { type: Date },

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

module.exports = mongoose.model("Institute_Form", instituteFormSchema);
