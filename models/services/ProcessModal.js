const mongoose = require('mongoose')

const processSchema = new mongoose.Schema({
  icon: { type: String },
  heading: { type: String },
});


const serviceProcessSchema = new mongoose.Schema({

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  process: { type: [processSchema] },
  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("Service_Process", serviceProcessSchema);

