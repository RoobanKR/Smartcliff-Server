const mongoose = require("mongoose");

const trainFromUsSchema = new mongoose.Schema({
  
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
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 

  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},

  enquiry: { type: String, required: true},
  type: {
    type: String,
    enum: ["upskilling", "fresher"],
    default: "fresher", 
  },
  count: {
    type: Number,
    default: "0", 

  },
  batch_size: {
    type: String,
    default: "0-10", 

  },
  location: {
    type: String,
    enum: ["client", "smartcliff","any"],
    default: "any", 
  },
  client_location: {
    type: String,
    default: null, 

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

});

module.exports = mongoose.model("Train_From_Us", trainFromUsSchema);
