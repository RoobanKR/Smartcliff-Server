const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
});


const serviceAboutSchema = new mongoose.Schema({

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  heading: { type: String, required: true },
  subHeading: {type: String,},
  feature: { type: [featureSchema] },
  images: [{ type: String, required: true }],

  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("Service_About", serviceAboutSchema);

