const mongoose = require("mongoose");

const contactPageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
 
});

module.exports = mongoose.model("Contact-page", contactPageSchema);
