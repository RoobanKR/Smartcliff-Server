const mongoose = require('mongoose');

const ourSponsorsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },

  logo: {type: String,required:true,max: 3 * 1024 * 1024},
  type: { type: String, required: true },
  category: { type: String, required: true },
  contributions: [{ type: String, required: true }],

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company",default:null},
//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Our_Sponsors', ourSponsorsSchema);
