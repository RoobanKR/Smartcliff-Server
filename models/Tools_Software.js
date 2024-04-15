const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
  software_name: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
},
category : [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],

});

module.exports = mongoose.model('Tool_Software', SoftwareSchema);
