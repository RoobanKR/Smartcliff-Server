const mongoose = require('mongoose')



const serviceClientSchema = new mongoose.Schema({

  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services"},
  image: { type: String },
  name: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date },

})

module.exports = mongoose.model("Service_Client", serviceClientSchema);

