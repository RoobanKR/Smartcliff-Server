const mongoose = require('mongoose');

const homeExecutionHighlightsSchema = new mongoose.Schema({
  stack: { type: String, required: true },
  count: { type: Number, required: true },

  image: {type: String,required:true,max: 5 * 1024 * 1024},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Home-Execution--Highlights', homeExecutionHighlightsSchema);
