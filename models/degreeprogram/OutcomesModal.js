const mongoose = require('mongoose');

const OutcomesSchema = new mongoose.Schema({
  title: { type: String, required: true },

  icon: {type: String,max: 3 * 1024 * 1024},
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services"},
    business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service' }, 
    degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program"},
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College",default:null},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Outcome', OutcomesSchema);
