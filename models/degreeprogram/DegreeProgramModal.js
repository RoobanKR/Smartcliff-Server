const mongoose = require('mongoose');

const DegreeProgramSchema = new mongoose.Schema({
  program_name: { type: String, required: true },
  slogan: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  year: { type: Number },

  images: [{type: String,required:true,max: 5 * 1024 * 1024}],
  slug: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  college: [{ type: mongoose.Schema.Types.ObjectId, ref: "College",default:null}],

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Degree_Program', DegreeProgramSchema);
