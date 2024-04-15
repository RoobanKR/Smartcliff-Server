const mongoose = require("mongoose");

const highlightsSchema = new mongoose.Schema({
  subheading: { type: String, required: true },
});
const highlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  versus: {
    type: [highlightsSchema],
    required: true,
  },
  highlight: {
    type: String,
    enum: ["smartcliff", "traditional"],
  },
  degree_program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Degree_Program",
    required: true,
  },

  //   lastModifiedBy: { type: String, required: true },
  //   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Highlight", highlightSchema);
