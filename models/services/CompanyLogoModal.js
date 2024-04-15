const mongoose = require('mongoose');

const companyLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },

  image: {type: String,required:true,max: 5 * 1024 * 1024},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  subtitle: { type: String,default:null },
//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company_Logo', companyLogoSchema);
