const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  month: { type: String, required: true },
  year: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String},
});

module.exports = mongoose.model("Gallery", gallerySchema);
