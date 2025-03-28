const mongoose = require("mongoose");
 
const faqSchema = new mongoose.Schema({
  faqItems: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  type: {
    type: String,
    enum: ["hirefromus", "trainfromus", "institute", null], // Allow null as a valid value
    default: null,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    default: null,
  },
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",    default: null,
},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",    default: null,
},
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', default: null }, 


  category_name: { type: String, default: "common" },
  lastModifiedOn: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model("Faq", faqSchema);