const mongoose = require("mongoose");

const applyNowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},
  reference: {
    type: String,
    default: "self", 
},
});

module.exports = mongoose.model("Course_ApplyNow", applyNowSchema);
