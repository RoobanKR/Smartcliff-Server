const mongoose = require('mongoose');

const ourPartnersSchema = new mongoose.Schema({
  company: { type: String, required: true },
  image: {type: String,required:true,max: 3 * 1024 * 1024},
  websiteLink: { type: String, required: true },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Our_Partners', ourPartnersSchema);
