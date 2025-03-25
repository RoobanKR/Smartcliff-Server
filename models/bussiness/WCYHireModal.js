const mongoose = require('mongoose')

const wcyDefSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
});

const WCYHireSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: {type: String,},
  image: { type: String, required: true },
  wcyDefinition: { type: [wcyDefSchema] },
  createdBy: { type: String },
  createdAt: { type: Date, required: true },
  type: { type: String, enum: ["hirefromus", "trainfromus", "institute"] },

})

module.exports = mongoose.model("WCY_Hire", WCYHireSchema);

