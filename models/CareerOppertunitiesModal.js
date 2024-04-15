const mongoose = require('mongoose');

const careerOppertunitiesSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  description: { type: String, required: true },

  image: {
    type: String, // Assuming you will store a URL to the profile picture
},
course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CareerOppertunities', careerOppertunitiesSchema);
