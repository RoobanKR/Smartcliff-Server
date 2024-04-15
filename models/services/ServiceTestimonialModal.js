const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  image: {type: String,required:true,max: 5 * 1024 * 1024},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  stack: { type: mongoose.Schema.Types.ObjectId, ref: "Execution_Highlights",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service_Testimonial', testimonialSchema);
