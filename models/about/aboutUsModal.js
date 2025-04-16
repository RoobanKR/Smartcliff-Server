const mongoose = require('mongoose')

const aboutusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  
  createdBy: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  updatedBy: { type: String},
  updatedOn: { type: Date, default: Date.now },


})

module.exports = mongoose.model('about-aboutus', aboutusSchema)

