const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
});


const homeServiceSchema = new mongoose.Schema({

  heading: { type: String, required: true },
  description: {type: String,},
  feature: { type: [featureSchema] },

  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("home-Service", homeServiceSchema);

