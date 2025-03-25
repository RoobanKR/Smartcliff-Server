const mongoose = require("mongoose");


const collegeSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  collegeName: { type: String, required: true },
  description: { type: String, required: true },

  image: { type: String, required: true, max: 3 * 1024 * 1024 },
  logo: { type: String, required: true, max: 3 * 1024 * 1024 },

  location: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  website: { type: String, required: true },


  //   lastModifiedBy: { type: String, required: true },
  //   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("College", collegeSchema);
