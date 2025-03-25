const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  duration: { type: String },
  tool_software: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool_Software', required: true }],
  lessons: [
    {
      title: { type: String, required: true, trim: true },
      content: [{ type: String, required: true }],
      duration: { type: Number, default: 0 },
    }
  ]
});

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  course_name: { type: String, required: true },
  short_description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  objective: { type: String, required: true },
  duration: { type: Number, required: true },
  mode_of_training: { type: String, required: true },
  number_of_assessments: { type: Number, required: true },
  projects: { type: Number, required: true },
  course_level: [levelSchema],
}, { timestamps: true }); 

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
