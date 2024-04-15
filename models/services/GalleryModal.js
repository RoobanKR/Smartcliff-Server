const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: {type: String,required:true,max: 5 * 1024 * 1024},

  year: { type: Number, required: true },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service_Gallery', gallerySchema);
