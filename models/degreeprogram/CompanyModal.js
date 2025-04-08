const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  description: { type: String, required: true },

  logo: { type: String, required: true, max: 3 * 1024 * 1024 },

  website: { type: String, required: true },
  year: { type: String, required: true },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 

  //   lastModifiedBy: { type: String, required: true },
  //   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
