const mongoose = require('mongoose');

const executionHighlightsSchema = new mongoose.Schema({
  stack: { type: String, required: true },
  count: { type: Number, required: true },

  image: {type: String,required:true,max: 5 * 1024 * 1024},
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Execution_Highlights', executionHighlightsSchema);
