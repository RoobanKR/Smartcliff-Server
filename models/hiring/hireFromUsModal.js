const mongoose = require("mongoose");

const hiringFromUsSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  designation: {
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
  count: {
    type: Number,
    required: true,
  },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},

  enquiry: { type: String, required: true},
});

module.exports = mongoose.model("Hire_From_Us", hiringFromUsSchema);
