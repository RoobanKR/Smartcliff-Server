const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["current", "upcoming", "completed"], // Corrected spelling
    default: "upcomming", // Default value
  },
  hiring_id: {
    type: String,
    required: true,
    unique: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  company_logo: {
    type: String,
    max: 5 * 1024 * 1024,
    required: true,
  },
  eligibility : [
    {
      type: String,
      required: true,
    },
  ],
  yop: {
    type: Number,
    required: true,
    min: 2020, 
    max: new Date().getFullYear(), 
  },
  start_date: { type: String, required: true},

  end_date: { type: String, required: true},

  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hiring", hiringSchema);
