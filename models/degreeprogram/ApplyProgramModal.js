const mongoose = require("mongoose");

const applyProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  degreeProgram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Degree_Program",
    required: true,
  },
  Tid: { type: String },
  image: { type: String },
  status: { type: String },
});

module.exports = mongoose.model("ApplyProgram", applyProgramSchema);
