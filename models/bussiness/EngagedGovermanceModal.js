const mongoose = require('mongoose');

const engagedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {type: String,required:true,max: 5 * 1024 * 1024},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Engaged_Govermence', engagedSchema);
