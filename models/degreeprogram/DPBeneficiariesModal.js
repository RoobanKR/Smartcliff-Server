const mongoose = require("mongoose");


const beneficiariesSchema = new mongoose.Schema({
    type: { type: String, enum: ["degreeprogram", "skilling"] },

  noOfCandidates: { type: String, required: true },
  college: { type: String,  },
  programme: { type: String,  },

  batch: { type: String,  },
  hours: { type: String,  },
  duration: { type: String, },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company",default:null},

  //   lastModifiedBy: { type: String, required: true },
  //   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DPBeneficiaries", beneficiariesSchema);
