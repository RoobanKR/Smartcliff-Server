const mongoose = require('mongoose')

const wcuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },

  // lastModifiedBy: { type: String, required: true },
  // lastModifiedOn: { type: Date, default: Date.now },
})

module.exports = mongoose.model('wcu', wcuSchema)

