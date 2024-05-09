const mongoose = require('mongoose');

const DegreeProgramSchema = new mongoose.Schema({
  program_name: { type: String, required: true },
  slogan: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{type: String,required:true,max: 5 * 1024 * 1024}],
  slug: { type: String, required: true },

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Degree_Program', DegreeProgramSchema);
