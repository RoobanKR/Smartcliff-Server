const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services"},
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", EnquirySchema);
