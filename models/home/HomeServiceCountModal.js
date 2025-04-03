const mongoose = require('mongoose')


const homeServiceCountSchema = new mongoose.Schema({

  count: { type: String, required: true },
  service: {type: String,},
  slug: {type: String,},

  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("home-Service-count", homeServiceCountSchema);

