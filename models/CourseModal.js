const mongoose = require('mongoose');

// Changed courseOutline to accept a single object
const courseOutlineSchema = new mongoose.Schema({
  modules: [{ type: String, required: true }]
});

// Changed elements/hours to String instead of [String]
const courseSummarySchema = new mongoose.Schema({
  elements: { type: String, required: true },
  hours: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  course_name: { type: String, required: true },
  short_description: { type: String, required: true },
  tool_software: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool_Software', required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  objective: { type: String, required: true },
  duration: { type: Number, required: true },
  mode_of_training: { type: String, required: true },
  number_of_assessments: { type: Number, required: true },
  projects: { type: Number, required: true },
  courseOutline: courseOutlineSchema, // changed from array
  courseSummary: [courseSummarySchema],
  isOpen: { type: Boolean,default:false },

}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
