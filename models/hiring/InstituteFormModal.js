const mongoose = require("mongoose");

const instituteFormSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  designation: {
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
  no_of_students: {
    type: Number,
    required: true,
  },
  target_year: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  duration_type: {
    type: String,
    required: true,
    enum: ["day", "week","month"],
    default: "month", 
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 

  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

  enquiry: { type: String, required: true},
});

module.exports = mongoose.model("Institute_Form", instituteFormSchema);
