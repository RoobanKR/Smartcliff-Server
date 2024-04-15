const mongoose = require('mongoose');

const OutcomesSchema = new mongoose.Schema({
  title: { type: String, required: true },

  icon: {type: String,required:true,max: 5 * 1024 * 1024},
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Outcome', OutcomesSchema);
