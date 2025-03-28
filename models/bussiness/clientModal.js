const mongoose = require('mongoose')



const serviceClientSchema = new mongoose.Schema({

  image: { type: String },
  name: { type: String },
  type: { type: String, enum: ["trainfromus", "institute","smartcliff"] },

  createdBy: { type: String },
  createdAt: { type: Date },

})

module.exports = mongoose.model("client", serviceClientSchema);

