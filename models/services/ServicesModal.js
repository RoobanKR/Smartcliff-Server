const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },

  description: { type: String, required: true },

  image: {type: String,required:true,max: 5 * 1024 * 1024},
  videos: [{ type: String, required: true, max: 20 * 1024 * 1024 }], // Array of video URLs

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Services', servicesSchema);
