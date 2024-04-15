const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  course_name: { type: String, required: true },
  short_description: { type: String, required: true },
	objective: { type: String, required: true },
  cost: { type: Number ,required:true},
  images: [{type: String,required: true}],
	course_level : { type: String, required: true },
  duration: { type: Number ,required:true},
  mode_of_trainee: { type: String, required: true },
  certificate : { type: String, required: true },
  number_of_assesment : { type: Number, required: true },
  projects : { type: Number, required: true },
  tool_software: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool_Software', required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  instructor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true }],

})

const WCUModel = mongoose.model('Course', courseSchema)

module.exports = WCUModel
