const mongoose = require("mongoose");



const skillSchema = new mongoose.Schema({
  skillset: { type: String, required: true },
  resources: { type: String, required: true },
});


const hiringFromUsSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
 
  company_name: {
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
  skillsetRequirements: { type: [skillSchema] },

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

module.exports = mongoose.model("Hire_From_Us", hiringFromUsSchema);
