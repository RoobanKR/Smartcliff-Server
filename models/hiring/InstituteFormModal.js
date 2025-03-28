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
  services: { type: [serviceSchema] },  //placementtraning,internship,skilling

  enquiry: { type: String, required: true},
});

module.exports = mongoose.model("Institute_Form", instituteFormSchema);
