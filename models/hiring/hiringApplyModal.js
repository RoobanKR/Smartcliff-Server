const mongoose = require("mongoose");

const hiringApplySchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
},
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  yop: { type: Number, required: true},

  highest_level_education: { type: String, required: true},
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Hiring', required: true }, 

});

module.exports = mongoose.model("Hiring_Apply", hiringApplySchema);
