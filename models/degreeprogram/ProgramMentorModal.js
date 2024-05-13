const mongoose = require('mongoose');

const programMentorSchema = new mongoose.Schema({
 name: { type: String, required: true },
 designation: { type: String, required: true },
 image: {type: String,required:true,max: 5 * 1024 * 1024},
 degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
});

module.exports = mongoose.model('Program_Mentor', programMentorSchema);
