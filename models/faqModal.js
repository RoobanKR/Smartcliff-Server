const mongoose = require("mongoose");
 
const faqSchema = new mongoose.Schema({
  faqItems: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null,
  },
  degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",    default: null,
},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",    default: null,
},

  category_name: { type: String, default: "common" },
  lastModifiedOn: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model("Faq", faqSchema);