const mongoose = require('mongoose')

const wcuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  table: { type: Array, default: [] },
  lastModifiedBy: { type: String, required: true },
  lastModifiedOn: { type: Date, default: Date.now },
})

const WCUModel = mongoose.model('wcu', wcuSchema)

module.exports = WCUModel
