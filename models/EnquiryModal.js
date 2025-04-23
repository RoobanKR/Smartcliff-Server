const mongoose = require("mongoose");
 
const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  courses: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
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
 
module.exports = mongoose.model("Enquiry", EnquirySchema);
 
 