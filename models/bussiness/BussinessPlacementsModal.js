const mongoose = require('mongoose');

const placememntsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  image: {type: String,required:true,max: 5 * 1024 * 1024},
  designation: { type: String, required: true },
  type: { type: String, enum: ["hirefromus", "trainfromus", "institute"] },

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bussiness_Placements', placememntsSchema);
