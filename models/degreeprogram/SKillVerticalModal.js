const mongoose = require('mongoose');


// Define the schema for skill verticals
const SkillVerticalSchema = new mongoose.Schema({
  vertical: { type: String, required: true },
  name: { type: String, required: true },
  batchSize: { type: String, required: true },
  prerequisites: [{ type: String }],
  coreSubjects: [{ type: String }],
});
  
// Define the main schema for skills
const skillSchema = new mongoose.Schema({
  programName: { type: String, default: 'Industry Driven MCA Program' },
  skillVerticals: [SkillVerticalSchema], // Use the skill vertical schema
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College",default:null},

});

// Export the model
module.exports = mongoose.model('Skill-Vertical', skillSchema);