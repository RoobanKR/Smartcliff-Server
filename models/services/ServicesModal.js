const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  business_services: { type: mongoose.Schema.Types.ObjectId, ref: "business_service", required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },

  description: { type: String, required: true },

  icon: {type: String,required:true,max: 5 * 1024 * 1024},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Services', servicesSchema);
