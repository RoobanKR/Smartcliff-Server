const mongoose = require('mongoose');

const keyelementsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: {type: String,required:true,max: 3 * 1024 * 1024},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Key_Elements', keyelementsSchema);
