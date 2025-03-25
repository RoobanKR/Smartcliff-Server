const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile: { type: String, required: true, max: 5 * 1024 * 1024 },
  description: { type: String },
  experience: { type: Number, required: true },
  qualification: { type: String, required: true },
  specialization: [{ type: String, required: true }],
  category : [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
});

module.exports = mongoose.model("Instructor", instructorSchema);
