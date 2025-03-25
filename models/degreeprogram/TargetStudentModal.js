const mongoose = require('mongoose');

const targetStudentSchema = new mongoose.Schema({
 description: { type: String, required: true },
    bgColor: { type: String, required: true },
 icon: {type: String,required:true,max: 3 * 1024 * 1024},
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
    business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
    degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},
});

module.exports = mongoose.model('Target-Studnet', targetStudentSchema);
