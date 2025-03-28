const mongoose = require('mongoose');

const ourProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

   icon: {type: String,required:true,max: 3 * 1024 * 1024},
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
    business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
    degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College",default:null},
  

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Our_Program', ourProgramSchema);
