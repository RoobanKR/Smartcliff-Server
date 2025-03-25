const mongoose = require('mongoose');

const innerSchema = new mongoose.Schema({
  
inner_heading: { type: String},
inner_subheading: { type: String},
});

const semSchema = new mongoose.Schema({
  
  semester: { type: String, required: true },

    heading: { type: String, required: true },
  subheading: { type: String, required: true },
  icon: { type: String, }, 

  submain: [innerSchema]
  });
const semesterSchema = new mongoose.Schema({
  description: { type: String },
    semester: {
        type: [semSchema],
        required: true
      }, 
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
    business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
    degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College",default:null},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Semester', semesterSchema);
