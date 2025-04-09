const mongoose = require("mongoose");
 
const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  courses: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model("Enquiry", EnquirySchema);
 
 