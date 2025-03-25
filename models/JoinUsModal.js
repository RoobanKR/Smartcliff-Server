const mongoose = require('mongoose')



const joinUsSchema = new mongoose.Schema({

  job_position: { type: String },
  description: { type: String },
  selected: { type: Boolean },

  createdBy: { type: String },
  createdAt: { type: Date },

})

module.exports = mongoose.model("JoinUs", joinUsSchema);

