const mongoose = require('mongoose');

const careerOppertunitiesSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  description: { type: String, required: true },

  image: {
    type: String,
},
service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('service_Oppertunities', careerOppertunitiesSchema);
