const mongoose = require('mongoose')

const branchesSchema = new mongoose.Schema({
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},
  branch: { type: String, required: true },
  image: {type: String,required: true},
  batch_type: {type: String, enum: ["online", "offline",]},
  mode_of_type:{ type: String, required: true },
  start_date: { type: String, required: true},
  duration: { type: String, required: true },
  contact: { type: String, required: true },
})

module.exports = mongoose.model("Batches", branchesSchema);

