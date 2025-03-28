const mongoose = require("mongoose");


const collegeSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  collegeName: { type: String, required: true },
  description: { type: String, required: true },

  logo: { type: String, required: true, max: 3 * 1024 * 1024 },

  website: { type: String, required: true },


  //   lastModifiedBy: { type: String, required: true },
  //   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("College", collegeSchema);
