const mongoose = require('mongoose')

const shineDefSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  color: { type: String, required: true },
});


const shineSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: {type: String,},
  image: { type: String, required: true },
  shineDefinition: { type: [shineDefSchema] },

  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("Shine", shineSchema);

